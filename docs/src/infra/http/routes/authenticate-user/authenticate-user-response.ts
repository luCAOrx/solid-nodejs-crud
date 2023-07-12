import { type Response } from "swagger-jsdoc";

export const authenticateUserResponse: Response = {
  description: "HTTP response to error in authenticate a user",
  content: {
    "application/json": {
      example: {
        statusCode: 400,
        message: "Invalid email or password",
        error: "Bad request",
      },
    },
  },
};
