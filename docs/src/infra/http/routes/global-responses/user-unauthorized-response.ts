import { type Response } from "swagger-jsdoc";

export const httpResponseToUnauthorizedClient: Response = {
  description: "HTTP response to error user unauthorized",
  content: {
    "application/json": {
      examples: {
        theTokenShouldNotBeEmpty: {
          summary: "The token should not be empty",
          value: {
            statusCode: 401,
            message: "The token should bot be empty",
            error: "Unauthorized",
          },
        },

        theTokenShouldBeTwoParts: {
          summary: "The token should be two parts",
          value: {
            statusCode: 401,
            message: "The token should be two parts",
            error: "Unauthorized",
          },
        },

        theTokenShouldBeStartWithBearerWord: {
          summary: "The token should be start with Bearer word",
          value: {
            statusCode: 401,
            message: "The token should be start with Bearer word",
            error: "Unauthorized",
          },
        },

        theTokenIsInvalid: {
          summary: "The token is invalid",
          value: {
            statusCode: 401,
            message: "The token is invalid",
            error: "Unauthorized",
          },
        },
      },
    },
  },
};
