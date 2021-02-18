module.exports = async ({ table: TableName, ddb, key, value }) =>
  ddb
    .delete({
      TableName,
      Key: {
        [key]: value,
      },
    })
    .promise();
