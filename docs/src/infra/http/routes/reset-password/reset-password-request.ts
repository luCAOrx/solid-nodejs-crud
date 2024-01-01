import { type Operation } from "swagger-jsdoc";

import { resetPasswordResponse } from "./reset-password-response";

export const resetPasswordRequest: Operation = {
  tags: ["User"],
  summary: "Reset password",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ResetPasswordRequestBody",
        },
        example: {
          email: "johndoe@example.com",
          code: "12345",
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
        },
      },
    },
  },
  responses: resetPasswordResponse,
};
