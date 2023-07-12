import { type Operation } from "swagger-jsdoc";

import { getUsersResponse } from "./get-users-response";

export const getUsersRequest: Operation = {
  tags: ["User"],
  summary: "Get users",
  description: "This route get 5 users per page",
  parameters: [
    {
      in: "query",
      name: "page",
      required: true,
      schema: {
        type: "number",
        properties: {
          page: {
            type: "number",
          },
        },
      },
      example: "1",
    },
    {
      in: "query",
      name: "takePage",
      required: true,
      schema: {
        type: "number",
        properties: {
          page: {
            type: "number",
          },
        },
        example: "5",
      },
    },
  ],
  responses: getUsersResponse,
};
