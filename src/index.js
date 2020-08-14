const AWS = require('aws-sdk');

const put = async ({ ddb, table, item }) => {
  const { Attributes = {} } = await ddb
    .put({
      TableName: table,
      Item: item,
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return {
    ...Attributes,
    ...item,
  };
};

const getter = async ({ ddb, table, key, value }) => {
  const response = await ddb
    .get({
      TableName: table,
      Key: {
        [key]: value,
      },
    })
    .promise();

  if (response && response.Item) return response.Item;
};

const updater = async ({ ddb, table, key, value, item }) => {
  if (!key || !value) {
    throw new Error('A primary key is needed to update a record');
  }

  const exists = await getter({ ddb, table, key, value, item });
  return put({
    ddb,
    table,
    item: {
      ...item,
      ...exists,
    },
  });
};

const creator = async ({ ddb, table, key, value, item }) => {
  const exists = await getter({ ddb, table, key, value, item });
  if (exists) {
    throw new Error(`A record already exists with that ${key}`);
  }

  return put({ ddb, table, item });
};

const destroy = async ({ ddb, table, key, value }) =>
  ddb
    .delete({
      TableName: table,
      Key: {
        [key]: value,
      },
    })
    .promise();

const queryable = async ({ ddb, table, key, value, indexes }) => {
  const foundIndex = indexes.find((it) => it.key === key);
  if (!foundIndex) {
    throw new Error('No index found for key', key);
  }

  const response = await ddb
    .query({
      TableName: table,
      IndexName: foundIndex.name,
      Limit: 5,
      KeyConditionExpression: `${key} = :${key}`,
      ExpressionAttributeValues: {
        [`:${key}`]: value,
      },
    })
    .promise();

  return response && response.Items ? response.Items : [];
};

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
      getter({
        ...baseParams,
        value: pk,
      }),

    create: (item) => {
      const { [key]: value } = item;

      return creator({ ...baseParams, value, item });
    },

    update: (item) => {
      const { [key]: value } = item;
      return updater({ ...baseParams, value, item });
    },

    delete: (pk) =>
      destroy({
        ...baseParams,
        value: pk,
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
