// const AWS = require('aws-sdk');

// const DDB = new AWS.DynamoDB({ region: 'us-east-1' });

// DDB.describeTable({
//   TableName: 'generic-dev',
// })
//   .promise()
//   .then((r) => console.log(JSON.stringify(r, null, 2)));

const AWS = require('aws-sdk');

const hash = (schema) =>
  schema.find((it) => it.KeyType === 'HASH').AttributeName;

const describe = async ({ table: TableName, awsOptions }) => {
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

describe({ table: 'generic-dev', awsOptions: { region: 'us-east-1' } }).then(
  console.log,
);
