const chunk = (it, size) => {
  const chunks = [];
  for (let i = 0; i < it.length; i += size) {
    chunks.push(it.slice(i, i + size));
  }

  return chunks;
};

const toPutRequest = (value) => ({
  PutRequest: {
    Item: value,
  },
});

const toDeleteRequest = (key) => (value) => ({
  DeleteRequest: {
    Key: { [key]: value },
  },
});

const batchGet = async ({ table: TableName, ddb, key, values }) => {
  const res = await Promise.all(
    chunk(values, 25).map((vs) =>
      ddb
        .batchGet({
          RequestItems: {
            [TableName]: {
              Keys: vs.map((value) => ({
                [key]: value,
              })),
            },
          },
        })
        .promise(),
    ),
  );

  const items = res.map((it) => it.Responses[TableName]);
  return [].concat(...items);
};

const batchPut = async ({ table: TableName, ddb, values }) =>
  Promise.all(
    chunk(values, 25).map((vs) =>
      ddb
        .batchWrite({
          RequestItems: {
            [TableName]: vs.map(toPutRequest),
          },
        })
        .promise(),
    ),
  );

const batchDelete = async ({ table: TableName, ddb, key, values }) =>
  Promise.all(
    chunk(values, 25).map((vs) =>
      ddb
        .batchWrite({
          RequestItems: {
            [TableName]: vs.map(toDeleteRequest(key)),
          },
        })
        .promise(),
    ),
  );

module.exports = {
  batchGet,
  batchPut,
  batchDelete,
};
