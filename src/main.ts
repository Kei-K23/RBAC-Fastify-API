import config from "config";
import * as dotenv from "dotenv";
import { createServer } from "./utils/server";
dotenv.config();
const POST = config.get<number>("POST");
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

  app.listen({ port: POST, host: HOST }, async function (err) {
    if (err) {
      app.log.error(err);
      await app.close();
      process.kill;
    }
  });

  const signals = ["SIGINT", "SIGTERM"];

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({ app });
    });
  }
}

main();
