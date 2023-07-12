import { type Response } from "swagger-jsdoc";

export const userNotFoundResponse: Response = {
  description: "HTTP response to error in get user",
  content: {
    "application/json": {
      example: {
        summary: "User not found",
        value: {
          statusCode: 400,
          message: "User not found",
          error: "Bad request",
        },
      },
    },
  },
};
