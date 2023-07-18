import { type Response, type Responses } from "swagger-jsdoc";

import { httpResponseToPageNotFound } from "../global-responses/page-not-found-response";
import { httpResponseToUnauthorizedClient } from "../global-responses/user-unauthorized-response";

const httpResponseToSuccessRequest: Response = {
  description: "HTTP response to updated user data",
  content: {
    "application/json": {
      example: {
        user: {
          id: "04deb5b7-8fe0-4885-9dac-ac2683d89e75",
          name: "John Doe",
          job: "doctor",
          email: "johndoe@example.com",
          read_time: 0,
          created_at: "2023-07-08T15:37:23.874Z",
          updated_at: "2023-07-08T15:37:23.874Z",
        },
      },
    },
  },
};

const httpResponseToClientError: Response = {
  description: "HTTP response to error in update user data",
  content: {
    "application/json": {
      examples: {
        theUserNotFound: {
          summary: "The user not found",
          value: {
            statusCode: 400,
            message: "User not found",
            error: "Bad request",
          },
        },

        theUserAlreadyExists: {
          summary: "The user already exists",
          value: {
            statusCode: 400,
            message: "The user already exists",
            error: "Bad request",
          },
        },

        theFieldNameShouldNotBeEmpty: {
          summary: "The field name should not be empty",
          value: {
            statusCode: 400,
            message: "The field name should not be empty",
            error: "Bad request",
          },
        },

        theFieldNameShouldBeThan5Characters: {
          summary: "The field name should be than 5 characters",
          value: {
            statusCode: 400,
            message: "The field name should be than 5 characters",
            error: "Bad request",
          },
        },

        theFieldNameShouldBeLessThan255Characters: {
          summary: "The field name should be less than 255 characters",
          value: {
            statusCode: 400,
            message: "The field name should be less than 255 characters",
            error: "Bad request",
          },
        },
      },
    },
  },
};

const httpResponseToInternalServerError: Response = {
  description:
    "HTTP response to update user without properties of request body",
  content: {
    "application/json": {
      example: {
        statusCode: 500,
        message:
          "The properties: name, job, email and password, should be provided in the request body",
        error: "Internal Server Error",
      },
    },
  },
};

export const updateUserResponse: Responses = {
  201: httpResponseToSuccessRequest,

  400: httpResponseToClientError,

  401: httpResponseToUnauthorizedClient,

  404: httpResponseToPageNotFound,

  500: httpResponseToInternalServerError,
};
