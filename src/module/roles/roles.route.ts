import { FastifyInstance } from "fastify";
import { CreateRoleInput, createRoleJsonSchema } from "./roles.schema";
import { createRoleHandler } from "./roles.controller";
import { PERMISSIONS } from "../../../config/permissions";

export async function roleRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateRoleInput;
  }>(
    "/",
    {
      schema: createRoleJsonSchema,
      preHandler: [fastify.guard.scope(PERMISSIONS["role:write"])],
    },
    createRoleHandler
  );
}
