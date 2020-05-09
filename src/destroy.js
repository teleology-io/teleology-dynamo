export default async ({ client, table, key, value }) =>
  client
    .delete({
      TableName: table,
      Key: {
        [key]: value,
      },
    })
    .promise();
