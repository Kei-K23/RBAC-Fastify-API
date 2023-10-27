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
    const { name, applicationId, permissions } = req.body;
    const role = await createRole({
      name,
      applicationId,
      permissons: permissions,
    });
    if (!role) return res.status(400).send({ errro: "could not create role" });

    return res.status(201).send({ role });
  } catch (e: any) {
    return res.status(200).send({ error: e.message });
  }
}
