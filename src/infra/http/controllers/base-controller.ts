import { type Request, type Response } from "express";

interface JsonResponseProps {
  response: Response;
  statusCode: number;
  message?: string | object;
}

interface HttpResponseProps {
  response: Response;
  statusCode?: number;
  message?: string | object;
  error?: Error | string;
}

export abstract class BaseController {
  protected abstract executeImplementation(
    request: Request,
    response: Response
  ): Promise<any>;

  public async execute(request: Request, response: Response): Promise<void> {
    try {
      await this.executeImplementation(request, response);
    } catch (error: any) {
      process.stdout.write(`[BaseController]: Uncaught controller error`);
      process.stdout.write(error);
    }
  }

  public static jsonResponse({
    response,
    statusCode,
    message,
  }: JsonResponseProps): Response<any, Record<string, any>> {
    return response.status(statusCode).json(message);
  }

  public ok({
    response,
    message,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    if (message instanceof String || message instanceof Object) {
      response.type("application/json");

      return BaseController.jsonResponse({
        response,
        statusCode: 200,
        message,
      });
    } else {
      return response.sendStatus(200);
    }
  }

  public created({
    response,
    message,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    if (message instanceof String || message instanceof Object) {
      return BaseController.jsonResponse({
        response,
        statusCode: 201,
        message,
      });
    } else {
      return response.sendStatus(201);
    }
  }

  public noContent({
    response,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    return response.sendStatus(204);
  }

  public clientError({
    response,
    message,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    return BaseController.jsonResponse({
      response,
      statusCode: 400,
      message: {
        statusCode: 400,
        message: message ?? null,
        error: "Bad request",
      },
    });
  }

  public static unauthorized({
    response,
    message,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    return BaseController.jsonResponse({
      response,
      statusCode: 401,
      message: message ?? "Unauthorized",
    });
  }

  public forbidden({
    response,
    message,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    return BaseController.jsonResponse({
      response,
      statusCode: 403,
      message: message ?? "Forbidden",
    });
  }

  public static notFound({
    response,
    message,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    return BaseController.jsonResponse({
      response,
      statusCode: 404,
      message: message ?? "Not Found",
    });
  }

  public tooManyRequests({
    response,
    message,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    return BaseController.jsonResponse({
      response,
      statusCode: 429,
      message: message ?? "Too Many Requests",
    });
  }

  public internalServerError({
    response,
    error,
  }: HttpResponseProps): Response<any, Record<string, any>> {
    process.stdout.write(String(error));

    return BaseController.jsonResponse({
      response,
      statusCode: 500,
      message: error?.toString() ?? "Internal Server Error",
    });
  }
}
