import { FastifyReply, FastifyRequest } from "fastify";
import { createApplication, getApplications } from "./applications.service";
import { createApplicationBodyInput } from "./applications.schema";
import { createRole } from "../roles/roles.service";
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLE,
  USER_ROLE_PERMISSION,
} from "../../../config/permissions";

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

    const superAdminRole = await createRole({
      applicationId: application.id,
      name: SYSTEM_ROLE.SUPER_ADMIN,
      permissons: ALL_PERMISSIONS as unknown as Array<string>,
    });

    const applicationUserRole = await createRole({
      applicationId: application.id,
      name: SYSTEM_ROLE.APPLICATION_USER,
      permissons: USER_ROLE_PERMISSION,
    });

    return res
      .status(200)
      .send({ application, superAdminRole, applicationUserRole });
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
    return res.status(500).send({ error: e.message });
  }
}
