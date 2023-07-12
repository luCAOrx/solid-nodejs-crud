import { type SecurityScheme } from "swagger-jsdoc";

export const swaggerSecuritySchemes: SecurityScheme = {
  type: "http",
  scheme: "bearer",
  in: "header",
  bearerFormat: "JWT",
  name: "token",
  description:
    "The token for the user to be able to access routes that require authorization",
};
