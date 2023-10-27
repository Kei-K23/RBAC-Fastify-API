import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const createUserSchema = z
  .object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z
      .string({
        required_error: "email is required",
      })
      .email("invalid email format"),
    password: z
      .string({
        required_error: "password is required",
      })
      .min(6, "password must be at least 6 characters"),
    confirm_password: z
      .string({
        required_error: "confirm password is required",
      })
      .min(6, "password must be at least 6 characters"),
    applicationsId: z.string({
      required_error: "applicatino id is required",
    }),
    initialUser: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "confirm does not match with password",
    path: ["confirm_password"],
  });

const userLoginSechema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email("invalid email format"),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, "password must be at least 6 characters"),
  applicationsId: z.string({
    required_error: "applicatino id is required",
  }),
});

export type CreateUserInput = Omit<
  z.infer<typeof createUserSchema>,
  "confirm_password"
>;

export type UserLoginInput = z.infer<typeof userLoginSechema>;

export const createUserJsonSchema = {
  body: zodToJsonSchema(createUserSchema, "createUserSchema"),
};

export const userloginJsonSchema = {
  body: zodToJsonSchema(userLoginSechema, "userLoginSechema"),
};
