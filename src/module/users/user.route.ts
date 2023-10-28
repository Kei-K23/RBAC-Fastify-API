import { FastifyInstance } from "fastify";
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from "./user.controller";
import {
  AssignRoleToUserInput,
  assignRoleToUserJsonSchema,
  createUserJsonSchema,
  userloginJsonSchema,
} from "./user.schema";
import { PERMISSIONS } from "../../../config/permissions";

export async function userRoute(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );
  fastify.post("/login", { schema: userloginJsonSchema }, loginHandler);

  fastify.post<{
    Body: AssignRoleToUserInput;
  }>(
    "/roles",
    {
      schema: assignRoleToUserJsonSchema,
      preHandler: [fastify.guard.scope(PERMISSIONS["users:roles:write"])],
    },
    assignRoleToUserHandler
  );
}
