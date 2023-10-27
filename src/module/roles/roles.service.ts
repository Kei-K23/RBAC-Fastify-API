import { InferInsertModel, and, eq } from "drizzle-orm";
import { roles } from "../../db/schema";
import { db } from "../../db";

export async function createRole(payload: InferInsertModel<typeof roles>) {
  try {
    const role = await db.insert(roles).values(payload).returning();
    if (!role.length) throw new Error("could not create role");
    return role[0];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getRoleByName({
  name,
  applicationId,
}: {
  name: string;
  applicationId: string;
}) {
  try {
    const role = await db
      .select()
      .from(roles)
      .where(and(eq(roles.name, name), eq(roles.applicationId, applicationId)))
      .limit(1);

    if (!role.length) throw new Error("there is no role to assign");
    return role[0];
  } catch (e: any) {
    throw new Error(e.message);
  }
}
