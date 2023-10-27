import { FastifyInstance } from "fastify";
import { createUserHandler, loginHandler } from "./user.controller";
import { createUserJsonSchema, userloginJsonSchema } from "./user.schema";

export async function userRoute(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );
  fastify.post("/login", { schema: userloginJsonSchema }, loginHandler);
}
