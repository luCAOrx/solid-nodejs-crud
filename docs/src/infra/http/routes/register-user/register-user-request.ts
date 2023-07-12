import { type Operation } from "swagger-jsdoc";

import { registerUserResponse } from "./register-user-response";

export const registerUserRequest: Operation = {
  tags: ["User"],
  summary: "Register a new user",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/UserRequestBody",
        },
        example: {
          name: "John Doe",
          job: "Development",
          email: "johndoe@example.com",
          password: "1234567890",
        },
      },
    },
  },
  responses: registerUserResponse,
};
