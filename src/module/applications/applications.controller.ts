import { FastifyReply, FastifyRequest } from "fastify";
import { createApplication, getApplications } from "./applications.service";
import { createApplicationBodyInput } from "./applications.schema";

export async function createApplicationHandler(
  req: FastifyRequest<{
    Body: createApplicationBodyInput;
  }>,
  res: FastifyReply
) {
  try {
    const application = await createApplication({ name: req.body.name });
    if (!application)
      return res.status(500).send({ error: "could not create application" });
    return res.status(200).send({ data: application });
  } catch (e: any) {
    return res.status(500).send({ error: e });
  }
}

export async function getApplicationsHandler(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const results = await getApplications();
    if (results.length < 0)
      return res.status(500).send({ error: "could not create application" });
    return res.status(200).send({ data: results });
  } catch (e: any) {
    return res.status(500).send({ error: e });
  }
}
