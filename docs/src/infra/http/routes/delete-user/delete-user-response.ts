import { type Response, type Responses } from "swagger-jsdoc";

import { userNotFoundResponse } from "../global-responses/user-not-found-response";
import { httpResponseToUnauthorizedClient } from "../global-responses/user-unauthorized-response";

const httpResponseToSuccessRequest: Response = {
  description: "HTTP response to delete user",
  content: {
    "application/json": {
      example: {},
    },
  },
};

export const deleteUserResponse: Responses = {
  200: httpResponseToSuccessRequest,

  400: userNotFoundResponse,

  401: httpResponseToUnauthorizedClient,
};
