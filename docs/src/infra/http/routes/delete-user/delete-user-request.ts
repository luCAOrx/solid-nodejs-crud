import { type Operation } from "swagger-jsdoc";

import { deleteUserResponse } from "./delete-user-response";

export const deleteUserRequest: Operation = {
  tags: ["User"],
  summary: "Delete a user by id",
  description: "This route delete a user by id",
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
  responses: deleteUserResponse,
};
