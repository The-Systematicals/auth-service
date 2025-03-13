import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

import { DATABASE } from './src/databases/config.database';

async function runMigration() {
  try {
    console.log('Migration started...');

    const connectionString = DATABASE.url;
    const migrationsFolder = `./src/databases/migrations`;

    const pool = new Pool({ connectionString });
    const db = drizzle(pool);

    await migrate(db, { migrationsFolder }); // Dynamic migrations folder
    console.log('Migration was successful!');

    pool.end();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigration();
