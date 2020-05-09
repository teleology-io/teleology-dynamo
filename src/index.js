import AWS from 'aws-sdk';
import getter from './getter';
import creator from './creator';
import destroy from './destroy';
import queryable from './queryable';
import updater from './updater';

export default ({ table, key, indexes, awsSettings }) => {
  const client = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    ...awsSettings,
  });

  const baseParams = {
    client,
    table,
    key,
    indexes,
  };

  return {
    get: (value) =>
      getter({
        ...baseParams,
        value,
      }),

    create: (item) => {
      const { [key]: value } = item;

      return creator({ ...baseParams, value, item });
    },

    update: (item) => {
      const { [key]: value } = item;
      return updater({ ...baseParams, value, item });
    },

    delete: (value) =>
      destroy({
        ...baseParams,
        value,
      }),

    query: (keyVal) => {
      const [firstKey] = Object.keys(keyVal);
      return queryable({
        ...baseParams,
        key: firstKey,
        value: keyVal[firstKey],
      });
    },
  };
};
