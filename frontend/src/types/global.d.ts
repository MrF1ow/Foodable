export {};

// Create a type for the roles
export type Roles = "guest" | "user" | "admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
