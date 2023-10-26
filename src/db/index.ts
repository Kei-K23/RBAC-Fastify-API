import config from "config";
import { Pool } from "pg";

import { drizzle } from "drizzle-orm/node-postgres";

const dbURL = config.get<string>("DB_URL");

const pool = new Pool({
  connectionString: dbURL,
  ssl: true,
});

export const db = drizzle(pool);
