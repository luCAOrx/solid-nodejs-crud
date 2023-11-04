import { type Response, type Responses } from "swagger-jsdoc";

const httpResponseToCreatedResource: Response = {
  description: "HTTP response to newly registered refresh token",
  content: {
    "application/json": {
      example: {
        refreshToken: {
          id: "a7d837ca-13a1-46f2-9c13-dc6a0d88b849",
          expiresIn: 1698803045,
          userId: "26e3d999-4dd1-4b6b-b86f-2d7674d0940b",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI2ZTNkOTk5LTRkZDEtNGI2Yi1iODZmLTJkNzY3NGQwOTQwYiIsImlhdCI6MTY5ODgwMzAzMCwiZXhwIjoxNjk4ODAzMDQ1fQ.kPTxE5xcy0AUnNm6R7YjvJbvfdUB2T5PNaNSA5Qu3p0",
      },
    },
  },
};

const httpResponseToClientError: Response = {
  description: "HTTP response to error in refresh token",
  content: {
    "application/json": {
      examples: {
        refreshTokenNotFound: {
          summary: "The refresh token not found",
          value: {
            statusCode: 400,
            message: "Refresh token not found",
            error: "Bad request",
          },
        },

        thePropertyShouldBeProvidedInTheRequestBody: {
          summary:
            "HTTP response to refresh token without properties of request body",
          value: {
            statusCode: 400,
            message:
              "The property: refreshToken, should be provided in the request body",
            error: "Bad request",
          },
        },
      },
    },
  },
};

export const refreshTokenResponse: Responses = {
  201: httpResponseToCreatedResource,

  400: httpResponseToClientError,
};
