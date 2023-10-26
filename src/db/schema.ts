import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    applicationsId: uuid("applicationId").references(() => applications.id),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      cpk: primaryKey(users.email, users.applicationsId),
      idIndex: uniqueIndex("users_id_index").on(users.id),
    };
  }
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    applicationId: uuid("applicationId").references(() => applications.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    permissons: text("permissons").array().$type<Array<string>>(),
  },
  (roles) => {
    return {
      cpk: primaryKey(roles.name, roles.applicationId),
      idIndex: uniqueIndex("role_id_index").on(roles.id),
    };
  }
);

export const usersToRoles = pgTable(
  "users_to_roles",
  {
    applicationId: uuid("application_id").references(() => applications.id),
    userId: uuid("user_id").references(() => users.id),
    roleId: uuid("role_id").references(() => roles.id),
  },
  (usersToRoles) => {
    return {
      cpk: primaryKey(
        usersToRoles.applicationId,
        usersToRoles.userId,
        usersToRoles.roleId
      ),
    };
  }
);
