import { type Responses, type Response } from "swagger-jsdoc";

const httpResponseToSendingEmail: Response = {
  description: "HTTP response to send email to user",
  content: {
    "application/json": {
      example: {
        message:
          "A code so you can reset your password has been sent to your email, view your inbox, spam or trash.",
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

        unableToSendPasswordRecoveryEmailError: {
          summary: "Unable to send password recovery email",
          value: {
            statusCode: 400,
            message: "Unable to send password recovery email",
            error: "Bad request",
          },
        },

        thePropertyEmailShouldBeProvidedInTheRequestBody: {
          summary: "The property email should be provided in the request body",
          value: {
            statusCode: 400,
            message:
              "The property: email should be provided in the request body",
            error: "Bad request",
          },
        },
      },
    },
  },
};

export const forgotPasswordResponse: Responses = {
  201: httpResponseToSendingEmail,

  400: httpResponseToClientError,
};
