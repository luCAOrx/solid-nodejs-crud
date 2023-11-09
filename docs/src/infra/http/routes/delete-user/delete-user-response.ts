import { type Response, type Responses } from "swagger-jsdoc";

import { httpResponseToPageNotFound } from "../global-responses/page-not-found-response";
import { userNotFoundResponse } from "../global-responses/user-not-found-response";
import { httpResponseToUnauthorizedClient } from "../global-responses/user-unauthorized-response";

const httpResponseToSuccessRequest: Response = {
  description: "HTTP response to delete user",
  content: {
    "application/json": {
      example: null,
    },
  },
};

export const deleteUserResponse: Responses = {
  204: httpResponseToSuccessRequest,

  400: userNotFoundResponse,

  401: httpResponseToUnauthorizedClient,

  404: httpResponseToPageNotFound,
};
