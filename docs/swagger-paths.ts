import { type Paths } from "swagger-jsdoc";

import { authenticateUserRequest } from "./src/infra/http/routes/authenticate-user/authenticate-user-request";
import { deleteUserRequest } from "./src/infra/http/routes/delete-user/delete-user-request";
import { forgotPasswordRequest } from "./src/infra/http/routes/forgot-password/forgot-password-request";
import { getUserRequest } from "./src/infra/http/routes/get-user/get-user-request";
import { getUsersRequest } from "./src/infra/http/routes/get-users/get-users-request";
import { refreshTokenRequest } from "./src/infra/http/routes/refresh-token/refresh-token-request";
import { registerUserRequest } from "./src/infra/http/routes/register-user/register-user-request";
import { updateUserRequest } from "./src/infra/http/routes/update-user/update-user-request";

export const swaggerPaths: Paths = {
  "/users/register": {
    post: registerUserRequest,
  },

  "/users/authenticate": {
    post: authenticateUserRequest,
  },

  "/users/get-user/{id}": {
    get: getUserRequest,
  },

  "/users/get-users/{id}": {
    get: getUsersRequest,
  },

  "/users/update-user/{id}": {
    put: updateUserRequest,
  },

  "/users/delete-user/{id}": {
    delete: deleteUserRequest,
  },

  "/users/refresh-token": {
    post: refreshTokenRequest,
  },

  "/forgot-password": {
    post: forgotPasswordRequest,
  },
};
