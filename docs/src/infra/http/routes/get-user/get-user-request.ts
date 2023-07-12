import { type Operation } from "swagger-jsdoc";

import { getUserResponse } from "./get-user-response";

export const getUserRequest: Operation = {
  tags: ["User"],
  summary: "Get a user by id",
  description: "This route takes a user by id",
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
  responses: getUserResponse,
};
