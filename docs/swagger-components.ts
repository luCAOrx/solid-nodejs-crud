import { type Components } from "swagger-jsdoc";

export const swaggerComponents: Components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
      name: "token",
      description:
        "The token for the user to be able to access routes that require authorization",
    },
  },

  schemas: {
    User: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
        },
        name: {
          type: "string",
        },
        job: {
          type: "string",
        },
        email: {
          type: "string",
          format: "email",
        },
        password: {
          type: "string",
          format: "password",
        },
        read_time: {
          type: "number",
        },
        created_at: {
          type: "string",
          format: "date",
        },
        updated_at: {
          type: "string",
          format: "date",
        },
      },
    },

    UserRequestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        job: {
          type: "string",
        },
        email: {
          type: "string",
          format: "email",
        },
        password: {
          type: "string",
          format: "password",
        },
      },
    },

    UpdateUserRequestBody: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        job: {
          type: "string",
        },
        email: {
          type: "string",
          format: "email",
        },
        currentPassword: {
          type: "string",
          format: "password",
        },
        newPassword: {
          type: "string",
          format: "password",
        },
      },
    },

    UserRouteParams: {
      type: "string",
      properties: {
        id: {
          type: "string",
          format: "uuid",
        },
      },
    },

    UserRouteQueryParams: {
      type: "number",
      properties: {
        page: {
          type: "number",
        },
        takePage: {
          type: "number",
        },
      },
    },

    UserHttpError: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
        },
        message: {
          type: "string",
        },
        error: {
          type: "string",
        },
      },
    },

    RefreshTokenRequestBody: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
          format: "uuid",
        },
      },
    },

    ForgotPasswordRequestBody: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
        },
      },
    },
  },
};
