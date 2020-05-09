
export default async ({ client, table, key, value }) => {
  const response = await client
    .get({
      TableName: table,
      Key: {
        [key]: value,
      },
    })
    .promise();

  if (response && response.Item) return response.Item;
};
