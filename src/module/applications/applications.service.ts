import { db } from "../../db";
import { InferInsertModel } from "drizzle-orm";
import { applications } from "../../db/schema";

export async function createApplication(
  payload: InferInsertModel<typeof applications>
) {
  try {
    const application = await db
      .insert(applications)
      .values(payload)
      .returning();

    if (!application.length) throw new Error("could not create application");

    return application[0];
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getApplications() {
  try {
    const results = await db
      .select({
        id: applications.id,
        name: applications.name,
        createdAt: applications.createdAt,
      })
      .from(applications);
    if (!results.length) throw new Error("could not create application");

    return results;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
