import { type Operation } from "swagger-jsdoc";

import { updateUserResponse } from "./update-user-response";

export const updateUserRequest: Operation = {
  tags: ["User"],
  summary: "Update user data",
  description: "This route update a user by id",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        $ref: "#/components/schemas/UserRouteParams",
      },
      example: "04deb5b7-8fe0-4885-9dac-ac2683d89e75",
    },
  ],
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
  responses: updateUserResponse,
};
