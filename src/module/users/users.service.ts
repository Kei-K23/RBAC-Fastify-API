import { InferInsertModel, and, eq } from "drizzle-orm";
import { roles, users, usersToRoles } from "../../db/schema";
import { db } from "../../db";
import argon2 from "argon2";

export async function createUser(payload: InferInsertModel<typeof users>) {
  try {
    const hashPassword = await argon2.hash(payload.password);
    const user = await db
      .insert(users)
      .values({
        ...payload,
        password: hashPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        applicationsId: users.applicationsId,
      });
    if (!user.length) throw new Error("could not create user");
    return user[0];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getUserByApplicationId({
  applicationId,
}: {
  applicationId: string;
}) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.applicationsId, applicationId));

    return user;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function assignRoleToUser(
  payload: InferInsertModel<typeof usersToRoles>
) {
  try {
    const assignRoleToUser = await db
      .insert(usersToRoles)
      .values(payload)
      .returning();
    if (!assignRoleToUser.length)
      throw new Error("could not assign role to user");
    return assignRoleToUser[0];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getUserByEmail({
  email,
  applicationId,
}: {
  email: string;
  applicationId: string;
}) {
  try {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        applicationId: users.applicationsId,
        roleId: roles.id,
        permissions: roles.permissons,
      })
      .from(users)
      .where(
        and(eq(users.email, email), eq(users.applicationsId, applicationId))
      )
      .leftJoin(
        usersToRoles,
        and(
          eq(usersToRoles.userId, users.id),
          eq(usersToRoles.applicationId, users.applicationsId)
        )
      )
      .leftJoin(roles, eq(roles.id, usersToRoles.roleId));

    if (!user.length) return null;

    const result = user.reduce((acc, curr) => {
      if (!acc.id) {
        return {
          ...curr,
          permissions: new Set(curr.permissions),
        };
      }

      if (!curr.permissions) {
        return acc;
      }

      for (const permission of curr.permissions) {
        acc.permissions.add(permission);
      }

      return acc;
    }, {} as Omit<(typeof user)[number], "permissions"> & { permissions: Set<string> });

    return {
      ...result,
      permissions: Array.from(result.permissions),
    };
  } catch (e: any) {
    throw new Error(e.message);
  }
}
