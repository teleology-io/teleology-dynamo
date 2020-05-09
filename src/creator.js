import updater from './updater';
import getter from './getter';

export default async ({ client, table, key, value, item }) => {
  const exists = await getter({ client, table, key, value });
  if (exists) {
    throw new Error(`A record already exists with that ${key}`);
  }

  return updater({ client, table, key, value, item });
};
