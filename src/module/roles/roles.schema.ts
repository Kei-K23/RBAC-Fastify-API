import { z } from "zod";
import { ALL_PERMISSIONS } from "../../../config/permissions";
import zodToJsonSchema from "zod-to-json-schema";

const createRoleSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  applicationId: z
    .string({ required_error: "application id is required" })
    .uuid("invalid uuid"),
  permissions: z.array(z.enum(ALL_PERMISSIONS)),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const createRoleJsonSchema = {
  body: zodToJsonSchema(createRoleSchema, "createRoleSchema"),
};
