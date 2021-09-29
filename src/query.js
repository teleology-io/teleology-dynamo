/* eslint-disable no-await-in-loop */
module.exports = async ({ table: TableName, ddb, entries, indexes }) => {
  const expressions = entries
    .map(([k, v]) => {
      const indexExists = indexes.find((it) => it.key === k);
      if (!indexExists) {
        throw new Error('No index found for key', k);
      }

      return {
        indexName: indexExists.name,
        expression: `${k} = :${k}`,
        attribute: {
          [`:${k}`]: v,
        },
      };
    })
    .filter(Boolean);

  const [first, ...rest] = expressions;

  const params = {
    TableName,
    IndexName: first.indexName,
    KeyConditionExpression: first.expression,
    ExpressionAttributeValues: expressions.reduce(
      (a, b) => ({ ...a, ...b.attribute }),
      {},
    ),
  };

  if (rest && rest.length > 0) {
    params.FilterExpression = rest.map((it) => it.expression).join(' AND ');
  }

  let lastKey;
  let items = [];
  while (true) {
    const { Items = [], LastEvaluatedKey } = await ddb
      .query({
        ...params,
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
