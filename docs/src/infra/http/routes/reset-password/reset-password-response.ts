import { type Responses, type Response } from "swagger-jsdoc";

const httpResponseToResetPassword: Response = {
  description: "HTTP response to reset password",
  content: {
    "application/json": {
      example: {
        message: "Password recovered successfully",
      },
    },
  },
};

const httpResponseToClientError: Response = {
  description: "HTTP response to error in sending email to user",
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

        invalidCodeToResetPasswordError: {
          summary: "Invalid code to reset password",
          value: {
            statusCode: 400,
            message: "Invalid code to reset password",
            error: "Bad request",
          },
        },

        passwordResetTokenHasExpired: {
          summary: "Password reset token has expired",
          value: {
            statusCode: 400,
            message: "Password reset token has expired",
            error: "Bad request",
          },
        },

        passwordsDoNotMatch: {
          summary: "Passwords do not match",
          value: {
            statusCode: 400,
            message: "Passwords do not match",
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

        theFieldNewPasswordShouldBeThan10Characters: {
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
              "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
            error: "Bad request",
          },
        },
      },
    },
  },
};

export const resetPasswordResponse: Responses = {
  201: httpResponseToResetPassword,

  400: httpResponseToClientError,
};
