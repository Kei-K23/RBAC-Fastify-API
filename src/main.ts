import config from "config";
import * as dotenv from "dotenv";
import { createServer } from "./utils/server";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";
dotenv.config();
const PORT = config.get<number>("PORT");
const HOST = config.get<string>("HOST");

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof createServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await createServer();

  app.listen({ port: PORT, host: HOST }, async function (err) {
    if (err) {
      app.log.error(err);
      await app.close();
      process.exit(1);
    }
  });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  // stop the app
  const signals = ["SIGINT", "SIGTERM"];

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({ app });
    });
  }
}

main();
