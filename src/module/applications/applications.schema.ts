import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
const createApplicationBodySchema = z.object({
  name: z.string({
    required_error: "name is required!",
    invalid_type_error: "name must be type of string",
  }),
});

export type createApplicationBodyInput = z.infer<
  typeof createApplicationBodySchema
>;

export const createApplicationJsonSchema = {
  body: zodToJsonSchema(
    createApplicationBodySchema,
    "createApplicationBodySchema"
  ),
};
