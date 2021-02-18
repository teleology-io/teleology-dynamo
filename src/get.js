module.exports = async ({ table: TableName, ddb, key, value }) => {
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
