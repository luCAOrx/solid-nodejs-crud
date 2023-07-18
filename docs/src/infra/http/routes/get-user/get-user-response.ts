import { type Response, type Responses } from "swagger-jsdoc";

import { httpResponseToPageNotFound } from "../global-responses/page-not-found-response";
import { userNotFoundResponse } from "../global-responses/user-not-found-response";
import { httpResponseToUnauthorizedClient } from "../global-responses/user-unauthorized-response";

const httpResponseToSuccessRequest: Response = {
  description: "HTTP response to get user",
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

export const getUserResponse: Responses = {
  200: httpResponseToSuccessRequest,

  400: userNotFoundResponse,

  401: httpResponseToUnauthorizedClient,

  404: httpResponseToPageNotFound,
};
