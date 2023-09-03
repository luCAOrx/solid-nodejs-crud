import swaggerJSDoc, { type OAS3Options } from "swagger-jsdoc";

import { swaggerComponents } from "./swagger-components";
import { swaggerPaths } from "./swagger-paths";
import { swaggerSecuritySchemes } from "./swagger-security-schemes";

const swaggerOptions: OAS3Options = {
  apis: ["./routes/*.ts"],
  definition: {
    openapi: "3.1.0",
    info: {
      title: "SOLID Node.js CRUD",
      description:
        "Simple CRUD API RestFull to manage a user, using SOLID principles.",
      contact: {
        name: "Lucas 'luCAO' Cunha",
        email: "lucas.cunha@disroot.org",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: String(process.env.DOCUMENTATION_SERVER_URL),
        description: "Test API",
      },
    ],
    tags: [
      {
        name: "User",
        description: "Routes to manage a user.",
      },
    ],
    paths: swaggerPaths,
    components: swaggerComponents,

    securitySchemes: {
      bearerAuth: swaggerSecuritySchemes,
    },
  },
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
