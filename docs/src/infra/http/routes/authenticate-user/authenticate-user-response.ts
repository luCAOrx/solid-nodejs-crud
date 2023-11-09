import { type Responses, type Response } from "swagger-jsdoc";

const httpResponseToAuthenticateUser: Response = {
  description: "HTTP response to authenticate a user",
  content: {
    "application/json": {
      example: {
        user: {
          id: "e6983148-565c-45f2-bcb4-8862cb64269a",
          name: "John Doe",
          job: "development",
          email: "johndoe@example.com",
          read_time: 0,
          created_at: "2023-09-07T14:36:45.045Z",
          updated_at: "2023-09-07T14:36:45.045Z",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2Njk2NGUyLTEyMGUtNDE4Zi1iYjgxLWVkYzEyZDYwMjFhNiIsImlhdCI6MTY5NDA5NzY4MCwiZXhwIjoxNjk0MDk3NzAwfQ.jZaJ32Ws_AOcOK4XIB_b0R15b8om0hXtJA2MpqqgXnc",
        refreshToken: {
          id: "6b4c0021-be95-4245-bed3-3e35736eb139",
          expiresIn: 1698886442,
          userId: "5d88b9ad-eb89-4276-afce-a64b3718cf02",
          createdAt: "2023-11-02T00:53:47.630Z",
        },
      },
    },
  },
};

const httpResponseToClientError: Response = {
  description: "HTTP response to error in authenticate a user",
  content: {
    "application/json": {
      examples: {
        invalidEmailOrPassword: {
          statusCode: 400,
          message: "Invalid email or password",
          error: "Bad request",
        },

        thePropertiesShouldBeProvidedInTheRequestBody: {
          summary: "The properties should be provided in the request body",
          value: {
            statusCode: 400,
            message:
              "The properties: email and password, should be provided in the request body",
            error: "Bad request",
          },
        },
      },
    },
  },
};

export const authenticateUserResponse: Responses = {
  201: httpResponseToAuthenticateUser,

  400: httpResponseToClientError,
};
