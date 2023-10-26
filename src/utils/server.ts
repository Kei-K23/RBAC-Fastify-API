import fastify from "fastify";
import { applicationRoute } from "../module/applications/applications.route";

export async function createServer() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  // register plugins
  // register routes
  app.register(applicationRoute, { prefix: "/api/application" });
  return app;
}
