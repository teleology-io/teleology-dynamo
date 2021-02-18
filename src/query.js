/* eslint-disable no-await-in-loop */
module.exports = async ({ table: TableName, ddb, key, value, indexes }) => {
  const foundIndex = indexes.find((it) => it.key === key);
  if (!foundIndex) {
    throw new Error('No index found for key', key);
  }

  let lastKey;
  let items = [];
  while (true) {
    const { Items = [], LastEvaluatedKey } = await ddb
      .query({
        TableName,
        IndexName: foundIndex.name,
        KeyConditionExpression: `${key} = :${key}`,
        ExpressionAttributeValues: {
          [`:${key}`]: value,
        },
        ExclusiveStartKey: lastKey,
      })
      .promise();

    items = [...items, ...Items];
    lastKey = LastEvaluatedKey;

    if (!lastKey) {
      break;
    }
  }

  return items;
};
