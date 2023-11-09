import { type Response, type Responses } from "swagger-jsdoc";

import { httpResponseToUnauthorizedClient } from "../global-responses/user-unauthorized-response";

const httpResponseToSuccessRequest: Response = {
  description: "HTTP response to get users",
  content: {
    "application/json": {
      example: {
        userOrUsers: [
          {
            id: "c0ce96d0-8ae0-4a41-9f6a-50c5b643af41",
            name: "John Doe",
            job: "doctor",
            email: "joe19@example.com",
            read_time: 0,
            created_at: "2023-07-11T00:08:28.910Z",
            updated_at: "2023-07-11T00:08:28.910Z",
          },
          {
            id: "71696507-4445-4cbe-b644-13ab567143e1",
            name: "John Doe",
            job: "doctor",
            email: "joe18@example.com",
            read_time: 0,
            created_at: "2023-07-11T00:08:28.910Z",
            updated_at: "2023-07-11T00:08:28.910Z",
          },
          {
            id: "518811a4-6ee4-4ce7-95f4-0b06d68b2453",
            name: "John Doe",
            job: "doctor",
            email: "joe17@example.com",
            read_time: 0,
            created_at: "2023-07-11T00:08:28.910Z",
            updated_at: "2023-07-11T00:08:28.910Z",
          },
          {
            id: "d7236cd1-9d9d-4ca3-bb4a-fad5a3c25cca",
            name: "John Doe",
            job: "doctor",
            email: "joe16@example.com",
            read_time: 0,
            created_at: "2023-07-11T00:08:28.910Z",
            updated_at: "2023-07-11T00:08:28.910Z",
          },
          {
            id: "08895ea3-e25c-4100-9480-8ef11c17b79f",
            name: "John Doe",
            job: "doctor",
            email: "joe15@example.com",
            read_time: 0,
            created_at: "2023-07-11T00:08:28.910Z",
            updated_at: "2023-07-11T00:08:28.910Z",
          },
        ],
      },
    },
  },
};

const httpBadRequestResponse: Response = {
  description: "HTTP response to error in get user",
  content: {
    "application/json": {
      examples: {
        userNotFound: {
          summary: "User not found",
          value: {
            statusCode: 400,
            message: "User not found",
            error: "Bad request",
          },
        },

        accessDenied: {
          summary: "Access denied",
          value: {
            statusCode: 400,
            message: "Access denied",
            error: "Bad request",
          },
        },

        theQueryParametersShouldBeProvidedInTheRequestBody: {
          summary:
            "The query parameters should be provided in the query params",
          value: {
            statusCode: 400,
            message:
              "The query parameters: page and takePage, must be provided in the query parameters of the request",
            error: "Bad request",
          },
        },
      },
    },
  },
};

export const getUsersResponse: Responses = {
  200: httpResponseToSuccessRequest,

  400: httpBadRequestResponse,

  401: httpResponseToUnauthorizedClient,
};
