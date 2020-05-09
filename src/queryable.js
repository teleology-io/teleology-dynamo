
const queryable = async ({ client, table, key, value, indexes }) => {
  const foundIndex = indexes.find((it) => it.key === key);
  if (!foundIndex) {
    throw new Error('No index found for key', key);
  }

  const response = await client
    .query({
      TableName: table,
      IndexName: foundIndex.name,
      KeyConditionExpression: `${key} = :${key}`,
      ExpressionAttributeValues: {
        [`:${key}`]: value,
      },
    })
    .promise();

  return response && response.Items ? response.Items : [];
};
