import { FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleInput } from "./roles.schema";
import { createRole } from "./roles.service";

export async function createRoleHandler(
  req: FastifyRequest<{
    Body: CreateRoleInput;
  }>,
  res: FastifyReply
) {
  try {
    const role = await createRole(req.body);
  } catch (e: any) {
    return res.status(200).send({ error: e.message });
  }
}
