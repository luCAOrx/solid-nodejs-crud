import { type Operation } from "swagger-jsdoc";

import { refreshTokenResponse } from "./refresh-token-response";

export const refreshTokenRequest: Operation = {
  tags: ["User"],
  summary: "Refresh token",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/RefreshTokenRequestBody",
        },
        example: {
          refreshToken: "a7d837ca-13a1-46f2-9c13-dc6a0d88b849",
        },
      },
    },
  },
  responses: refreshTokenResponse,
};
