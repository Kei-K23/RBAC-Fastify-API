import { FastifyInstance } from "fastify";
import {
  createApplicationHandler,
  getApplicationsHandler,
} from "./applications.controller";
import { createApplicationJsonSchema } from "./applications.schema";

export async function applicationRoute(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: createApplicationJsonSchema,
    },
    createApplicationHandler
  );
  fastify.get("/", getApplicationsHandler);
}
