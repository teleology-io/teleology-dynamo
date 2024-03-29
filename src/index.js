const DynamoDB = require('aws-sdk/clients/dynamodb');
const queryDelegate = require('./query');
const getDelegate = require('./get');
const updateDelegate = require('./update');
const createDelegate = require('./create');
const destroyDelegate = require('./destroy');
const describe = require('./describe');
const batch = require('./batch');

const DEFAULT_MERGE = (old, n) => ({
  ...old,
  ...n,
});

export default ({ table, options }) => {
  let described = false;
  const ddb = new DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    ...options,
  });

  const baseParams = {
    table,
    ddb,
  };

  const init = async () => {
    if (!described) {
      const def = await describe({ table, options });
      Object.assign(baseParams, def);
      described = true;
    }
  };

  const query = async (keyVal) => {
    await init();

    return queryDelegate({
      ...baseParams,
      entries: Object.entries(keyVal),
    });
  };

  const get = async (pk) => {
    await init();

    return getDelegate({
      ...baseParams,
      value: pk,
    });
  };

  const update = async (item, merger = DEFAULT_MERGE) => {
    await init();

    const { [baseParams.key]: value } = item;
    return updateDelegate({
      ...baseParams,
      value,
      item,
      merge: merger,
    });
  };

  const create = async (item) => {
    await init();

    const { [baseParams.key]: value } = item;
    return createDelegate({
      ...baseParams,
      value,
      item,
    });
  };

  const batchGet = async (...keys) => {
    await init();

    return batch.batchGet({
      ...baseParams,
      values: keys,
    });
  };

  const batchDelete = async (...keys) => {
    await init();

    return batch.batchDelete({
      ...baseParams,
      values: keys,
    });
  };

  const batchPut = async (...entities) => {
    await init();

    return batch.batchPut({
      ...baseParams,
      values: entities,
    });
  };

  const destroy = async (pk) => {
    await init();

    return destroyDelegate({
      ...baseParams,
      query,
      value: pk,
    });
  };

  return {
    get,

    create,

    update,

    delete: destroy,

    batchGet,

    batchDelete,

    batchPut,

    query,
  };
};
