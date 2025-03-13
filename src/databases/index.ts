import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { DATABASE } from './config.database';
import * as schema from './schemas';

const createPool = (): Pool => {
  return new Pool({
    connectionString: DATABASE.url,
  });
};

// Now create pools using the function
const databasePool = createPool();

// Create Drizzle instances for each pool and schema
export const DB: NodePgDatabase<typeof schema> = drizzle(databasePool, { schema: schema });
