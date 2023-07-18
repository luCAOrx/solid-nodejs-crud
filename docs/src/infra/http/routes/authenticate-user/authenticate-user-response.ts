import { type Responses, type Response } from "swagger-jsdoc";

const httpResponseToAuthenticateUser: Response = {
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

const httpResponseToInternalServerError: Response = {
  description:
    "HTTP response to authenticate user without properties of request body",
  content: {
    "application/json": {
      example: {
        statusCode: 500,
        message:
          "The properties: email and password, should be provided in the request body",
        error: "Internal Server Error",
      },
    },
  },
};

export const authenticateUserResponse: Responses = {
  200: httpResponseToAuthenticateUser,

  500: httpResponseToInternalServerError,
};
