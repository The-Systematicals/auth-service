import { defineConfig } from 'drizzle-kit';

import { DATABASE } from './src/databases/config.database';

export default defineConfig({
  dialect: 'postgresql',
  schema: `./src/databases/schemas/*`,
  out: `./src/databases/migrations`,
  dbCredentials: {
    url: DATABASE.url,
  },
  strict: true,
  verbose: true,
});
