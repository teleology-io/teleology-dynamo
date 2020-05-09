
export default async ({ client, table, key, value, item }) => {
  if (!key || !value) {
    throw new Error('A primary key is needed to update a record');
  }

  const { Attributes = {} } = await client
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