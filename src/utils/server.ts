import fastify from "fastify";
import { applicationRoute } from "../module/applications/applications.route";
import { userRoute } from "../module/users/user.route";
import { roleRoute } from "../module/roles/roles.route";

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
  app.register(userRoute, { prefix: "/api/user" });
  app.register(roleRoute, { prefix: "/api/role" });
  return app;
}
