import fastify from "fastify";
import { applicationRoute } from "../module/applications/applications.route";
import { userRoute } from "../module/users/user.route";
import { roleRoute } from "../module/roles/roles.route";
import guard from "fastify-guard";
import jwt from "jsonwebtoken";
import config from "config";

type User = {
  id: string;
  scopes: Array<String>;
};

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

const SECRET = config.get<string>("SECRET");

export async function createServer() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  app.addHook("onRequest", async function (req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return;

    try {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, SECRET) as User;

      req.user = decoded;
    } catch (e: any) {
      return res.status(500).send({ error: e.message });
    }
  });

  // register plugins
  app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (result, req, res) => {
      return res
        .status(403)
        .send({ error: "you have no permission to perform this task" });
    },
  });

  // register routes
  app.register(applicationRoute, { prefix: "/api/application" });
  app.register(userRoute, { prefix: "/api/user" });
  app.register(roleRoute, { prefix: "/api/role" });
  return app;
}
