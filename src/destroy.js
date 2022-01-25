/* eslint-disable no-param-reassign */
module.exports = async ({ table: TableName, ddb, query, key, value }) => {
  if (value === Object(value)) {
    const res = await query(value);
    if (res.length === 1) {
      value = res[0][key];
    }
  }

  return ddb
    .delete({
      TableName,
      Key: {
        [key]: value,
      },
    })
    .promise();
};
