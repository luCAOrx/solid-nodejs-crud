import { type Operation } from "swagger-jsdoc";

import { authenticateUserResponse } from "./authenticate-user-response";

export const authenticateUserRequest: Operation = {
  tags: ["User"],
  summary: "Authenticate a user",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
        },
        example: {
          email: "johndoe@example.com",
          password: "1234567890",
        },
      },
    },
  },
  responses: {
    400: authenticateUserResponse,
  },
};
