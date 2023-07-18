import { type Response } from "swagger-jsdoc";

export const httpResponseToPageNotFound: Response = {
  description: "HTTP response to page not found",
  content: {
    "application/json": {
      example: {
        statusCode: 404,
        message: "Page not found",
        error: "Not Found",
      },
    },
  },
};
