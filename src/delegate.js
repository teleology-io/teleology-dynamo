const put = async ({ table: TableName, ddb, item }) => {
  const { Attributes = {} } = await ddb
    .put({
      TableName,
      Item: item,
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return {
    ...Attributes,
    ...item,
  };
};

const destroy = async ({ table: TableName, ddb, key, value }) =>
  ddb
    .delete({
      TableName,
      Key: {
        [key]: value,
      },
    })
    .promise();

const get = async ({ table: TableName, ddb, key, value }) => {
  const response = await ddb
    .get({
      TableName,
      Key: {
        [key]: value,
      },
    })
    .promise();

  if (response && response.Item) return response.Item;
};

const query = async ({ table: TableName, ddb, key, value, indexes }) => {
  const foundIndex = indexes.find((it) => it.key === key);
  if (!foundIndex) {
    throw new Error('No index found for key', key);
  }

  const response = await ddb
    .query({
      TableName,
      IndexName: foundIndex.name,
      KeyConditionExpression: `${key} = :${key}`,
      ExpressionAttributeValues: {
        [`:${key}`]: value,
      },
    })
    .promise();

  return response && response.Items ? response.Items : [];
};

const create = async ({ ddb, table, key, value, item }) => {
  const exists = await get({ ddb, table, key, value, item });
  if (exists) {
    throw new Error(`A record already exists with that ${key}`);
  }

  return put({ ddb, table, item });
};

const update = async ({ ddb, table, key, value, item }) => {
  if (!key || !value) {
    throw new Error('A primary key is needed to update a record');
  }

  const exists = await get({ ddb, table, key, value, item });

  return put({
    ddb,
    table,
    item: {
      ...item,
      ...exists,
    },
  });
};

module.exports = {
  query,
  get,
  put,
  update,
  create,
  destroy,
};
