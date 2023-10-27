import { FastifyInstance } from "fastify";
import { createRoleJsonSchema } from "./roles.schema";
import { createRoleHandler } from "./roles.controller";

export async function roleRoute(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: createRoleJsonSchema,
    },
    createRoleHandler
  );
}
