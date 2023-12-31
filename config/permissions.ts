export const ALL_PERMISSIONS = [
  //users
  "users:roles:write", // allow to add a role to a user
  "users:roles:delete", // allow to delete a role to a user

  //roles
  "role:write",

  //posts
  "posts:write",
  "posts:read",
  "posts:delete",
  "posts:edit",
] as const;

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, current) => {
  acc[current] = current;
  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSION = [
  PERMISSIONS["posts:read"],
  PERMISSIONS["posts:write"],
];

export const SYSTEM_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  APPLICATION_USER: "APPLICATION_USER",
};
