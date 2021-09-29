const get = require('./get');
const put = require('./put');

module.exports = async ({ ddb, table, key, value, item, merge }) => {
  if (!key || !value) {
    throw new Error('A primary key is needed to update a record');
  }

  const exist = await get({ ddb, table, key, value, item });

  return put({
    ddb,
    table,
    item: merge(exist, item),
  });
};
