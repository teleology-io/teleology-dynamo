module.exports = async ({ table: TableName, ddb, item }) => {
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
