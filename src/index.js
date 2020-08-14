const AWS = require('aws-sdk');
const delegate = require('./delegate');

export default ({ table, key, indexes, awsOptions }) => {
  const ddb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    ...awsOptions,
  });

  const baseParams = {
    table,
    key,
    ddb,
    indexes,
  };

  return {
    get: (pk) =>
      delegate.get({
        ...baseParams,
        value: pk,
      }),

    create: (item) => {
      const { [key]: value } = item;

      return delegate.create({ ...baseParams, value, item });
    },

    update: (item) => {
      const { [key]: value } = item;
      return delegate.update({ ...baseParams, value, item });
    },

    delete: (pk) =>
      delegate.destroy({
        ...baseParams,
        value: pk,
      }),

    query: (keyVal) => {
      const [firstKey] = Object.keys(keyVal);
      return delegate.query({
        ...baseParams,
        key: firstKey,
        value: keyVal[firstKey],
      });
    },
  };
};
