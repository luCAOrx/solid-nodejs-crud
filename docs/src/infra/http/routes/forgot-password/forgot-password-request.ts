import { type Operation } from "swagger-jsdoc";

import { forgotPasswordResponse } from "./forgot-password-response";

export const forgotPasswordRequest: Operation = {
  tags: ["User"],
  summary: "Forgot password",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ForgotPasswordRequestBody",
        },
        example: {
          email: "johndoe@example.com",
        },
      },
    },
  },
  responses: forgotPasswordResponse,
};
