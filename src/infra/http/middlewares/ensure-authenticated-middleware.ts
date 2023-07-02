import { type NextFunction, type Request, type Response } from "express";
import { verify } from "jsonwebtoken";

interface DecodedJwt {
  sub: string;
}

export class EnsureAuthenticated {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<NextFunction, Record<string, NextFunction>> | undefined> {
    const authHeader = request.headers.authorization;
    const parts = String(authHeader).split(" ");
    const [scheme, token] = parts;

    if (authHeader === null || authHeader === undefined) {
      return response.status(401).json({
        statusCode: 401,
        message: "The token should not be empty",
        error: "Unauthorized",
      });
    }

    if (parts.length !== 2) {
      return response.status(401).json({
        statusCode: 401,
        message: "The token should be two parts",
        error: "Unauthorized",
      });
    }

    if (!/^Bearer$/i.test(scheme)) {
      return response.status(401).json({
        statusCode: 401,
        message: "The token should be start with Bearer word",
        error: "Unauthorized",
      });
    }

    try {
      const { sub } = verify(
        String(token),
        String(process.env.JWT_SECRET)
      ) as DecodedJwt;

      request.user_id = sub;

      next();
    } catch (error) {
      return response.status(401).json({
        statusCode: 401,
        message: "The token is invalid",
        error: "Unauthorized",
      });
    }
  }
}
