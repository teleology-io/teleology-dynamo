const DynamoDB = require('aws-sdk/clients/dynamodb');

const hash = (schema) =>
  schema.find((it) => it.KeyType === 'HASH').AttributeName;

module.exports = async ({ table: TableName, options }) => {
  const ddb = new DynamoDB(options);
  const { Table } = await ddb.describeTable({ TableName }).promise();
  const { KeySchema, GlobalSecondaryIndexes = [] } = Table;

  return {
    table: TableName,
    key: hash(KeySchema),
    indexes: GlobalSecondaryIndexes.map((it) => ({
      key: hash(it.KeySchema),
      name: it.IndexName,
    })),
  };
};
