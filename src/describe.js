const AWS = require('aws-sdk');

const hash = (schema) =>
  schema.find((it) => it.KeyType === 'HASH').AttributeName;

module.exports = async ({ table: TableName, awsOptions }) => {
  const ddb = new AWS.DynamoDB(awsOptions);
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
