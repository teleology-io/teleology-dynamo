const AWS = require('aws-sdk');
const delegate = require('./delegate');

export default ({ table, awsOptions }) => {
  const ddb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    ...awsOptions,
  });

  const baseParams = {
    table,
    ddb,
  };

  return {
    get: async (pk) =>
      delegate.get({
        ...baseParams,
        value: pk,
      }),

    create: async (item) => {
      const { [key]: value } = item;

      return delegate.create({ ...baseParams, value, item });
    },

    update: async (item) => {
      const { [key]: value } = item;
      return delegate.update({ ...baseParams, value, item });
    },

    delete: async (pk) =>
      delegate.destroy({
        ...baseParams,
        value: pk,
      }),

    query: async (keyVal) => {
      const [firstKey] = Object.keys(keyVal);
      return delegate.query({
        ...baseParams,
        key: firstKey,
        value: keyVal[firstKey],
      });
    },
  };
};
