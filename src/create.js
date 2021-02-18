const get = require('./get');
const put = require('./put');

module.exports = async ({ ddb, table, key, value, item }) => {
  const exists = await get({ ddb, table, key, value, item });
  if (exists) {
    throw new Error(`A record already exists with that ${key}`);
  }

  return put({ ddb, table, item });
};
