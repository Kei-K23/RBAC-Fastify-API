import { FastifyRequest, FastifyReply } from "fastify";
import {
  assignRoleToUser,
  createUser,
  getUserByApplicationId,
  getUserByEmail,
} from "./users.service";
import { CreateUserInput, UserLoginInput } from "./user.schema";
import { SYSTEM_ROLE } from "../../../config/permissions";
import { getRoleByName } from "../roles/roles.service";
import jwt from "jsonwebtoken";
import config from "config";

const SECRET = config.get<string>("SECRET");

export async function createUserHandler(
  req: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  res: FastifyReply
) {
  try {
    const { initialUser, ...payload } = req.body;

    const roleName = initialUser
      ? SYSTEM_ROLE.SUPER_ADMIN
      : SYSTEM_ROLE.APPLICATION_USER;

    if (roleName === SYSTEM_ROLE.SUPER_ADMIN) {
      const appUsers = await getUserByApplicationId({
        applicationId: payload.applicationsId,
      });

      if (appUsers.length > 0)
        return res.status(400).send({
          errro: "Application has admin user role",
          extensions: {
            code: "APPLICATION_ALREADY_ADMIN_USER",
            applicationId: payload.applicationsId,
          },
        });
    }

    const role = await getRoleByName({
      name: roleName,
      applicationId: payload.applicationsId,
    });

    if (!role)
      return res.status(404).send({
        errro: "role not found",
      });

    const user = await createUser(payload);

    if (!user)
      return res.status(500).send({
        errro: "could not create user",
      });

    await assignRoleToUser({
      applicationId: payload.applicationsId,
      roleId: role.id,
      userId: user.id,
    });

    return res.status(201).send({ data: user });
  } catch (e: any) {
    return res.status(500).send({ error: e.message });
  }
}

export async function loginHandler(
  req: FastifyRequest<{
    Body: UserLoginInput;
  }>,
  res: FastifyReply
) {
  try {
    const { applicationsId, email, password } = req.body;

    const user = await getUserByEmail({ email, applicationId: applicationsId });
    if (!user)
      return res.status(401).send({ error: "invalid email or password" });

    const token = jwt.sign(
      {
        id: user.id,
        applicationsId,
        email,
        scopes: user.permissions,
      },
      SECRET
    );

    return res.status(200).send({ token });
  } catch (e: any) {
    return res.status(500).send({ error: e.message });
  }
}
