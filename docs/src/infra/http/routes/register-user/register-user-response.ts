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

        theFieldNameShouldBeGreaterThan5Characters: {
          summary: "The field name should be greater than 5 characters",
          value: {
            statusCode: 400,
            message: "The field name should be greater than 5 characters",
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

        theFieldJobShouldNotBeEmpty: {
          summary: "The field job should not be empty",
          value: {
            statusCode: 400,
            message: "The field job should not be empty",
            error: "Bad request",
          },
        },

        theFieldJobShouldBeGreaterThan5Characters: {
          summary: "The field job should be greater than 5 characters",
          value: {
            statusCode: 400,
            message: "The field job should be greater than 5 characters",
            error: "Bad request",
          },
        },

        theFieldJobShouldBeLessThan255Characters: {
          summary: "The field job should be less than 255 characters",
          value: {
            statusCode: 400,
            message: "The field job should be less than 255 characters",
            error: "Bad request",
          },
        },

        theFieldEmailShouldBeValidEmail: {
          summary: "The field email should be valid email",
          value: {
            statusCode: 400,
            message: "The field email should be valid email",
            error: "Bad request",
          },
        },

        theFieldEmailShouldBeLessThan255Characters: {
          summary: "The field email should be less than 255 characters",
          value: {
            statusCode: 400,
            message: "The field email should be less than 255 characters",
            error: "Bad request",
          },
        },

        theFieldNewPasswordShouldNotBeEmpty: {
          summary: "The field newPassword should not be empty",
          value: {
            statusCode: 400,
            message: "The field newPassword should not be empty",
            error: "Bad request",
          },
        },

        theFieldNewPasswordShouldBeGreaterThan5Characters: {
          summary: "The field newPassword should be greater than 10 characters",
          value: {
            statusCode: 400,
            message:
              "The field newPassword should be greater than 10 characters",
            error: "Bad request",
          },
        },

        theFieldNewPasswordShouldBeLessThan255Characters: {
          summary: "The field newPassword should be less than 255 characters",
          value: {
            statusCode: 400,
            message: "The field newPassword should be less than 255 characters",
            error: "Bad request",
          },
        },

        thePropertiesShouldBeProvidedInTheRequestBody: {
          summary: "The properties should be provided in the request body",
          value: {
            statusCode: 400,
            message:
              "The properties: name, job, email and password, should be provided in the request body",
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
