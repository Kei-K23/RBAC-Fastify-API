import fastify from "fastify";

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

  return app;
}
