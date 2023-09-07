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
      },
    },
  },
};

const httpResponseToClientError: Response = {
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

  400: httpResponseToClientError,

  500: httpResponseToInternalServerError,
};
