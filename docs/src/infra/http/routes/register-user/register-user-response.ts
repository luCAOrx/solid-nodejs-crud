import { type Response, type Responses } from "swagger-jsdoc";

const httpResponseToCreatedResource: Response = {
  description: "HTTP response to newly registered user",
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
  description: "HTTP response to error in register user",
  content: {
    "application/json": {
      examples: {
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

export const registerUserResponse: Responses = {
  201: httpResponseToCreatedResource,

  400: httpResponseToClientError,
};
