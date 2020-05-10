![Downloads][link-download] ![Version][link-version] ![License][link-license]

# @teleology/dynamo
A configurable client wrapper around DynamoDB.DocumentClient


# Installation 

```bash
yarn add aws-sdk @teleology/dynamo
# or
npm i --save aws-sdk @teleology/dynamo
```

# Configuration

Configuration is easy and mimics much of the pre-defined attributes of the DynamoDB table such as a table name, primary key, and secondary indexes. The library is aimed to be used within an AWS lambda context, if you are not within an environment that automatically handles this for you. You can pass the optional `awsOptions` to seed credentials, region and apiVersion for DynamoDB.DocumentClient. For concerned parties, the `awsOptions` are used in a pass-through fashion.

```javascript
import dynamo from '@teleology/dynamo';

const exampleTable = dynamo({
  table: process.env.EXAMPLE_TABLE,
  key: 'id',
  indexes: [
    {
      key: 'hid',
      name: 'HashGSI',
    },
  ],

  // (Optional) depending on environment
  awsOptions: {
    accessKeyId: 'your_access_key_id', 
    secretAccessKey: 'your_secret_access_key',
    region: 'us-east-1',
  }
});
```

# Usage 

```javascript

const exampleTable = ... // configuration example

const record = await exampleTable.create({
  id: '123',
  fName: 'Luke',
});

const updated = await exampleTable.update({
  id: '123',
  fName: 'Lucas',
  lName: 'Smith',
  hid: 'secondary-id',
});

const ping = await exampleTable.get('123');

const items = await exampleTable.query({ hid: 'secondary-id' });

await exampleTable.delete('123');
```

### Get

```javascript
async table.get(primaryKey: String) => Record || undefined
```

### Create

```javascript
async table.create(record: Object) => Record || Error
```

### Update

```javascript
async table.update(record: Object) => Record || Error
```

### Delete 

```javascript
async table.delete(primaryKey: String)
```

### Query

```javascript
async table.query(globalSecondaryKeyVal: Object) => Record[] || [];
```

# Changelog

**0.0.1**
- Initial upload


[link-download]: https://img.shields.io/npm/dt/@teleology/dynamo
[link-version]: https://img.shields.io/npm/v/@teleology/dynamo.svg
[link-license]: https://img.shields.io/npm/l/@teleology/dynamo.svg
