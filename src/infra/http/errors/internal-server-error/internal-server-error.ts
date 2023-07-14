import { type Request, type Response } from "express";

export const internalServerError = (
  request: Request,
  response: Response
): Response<any> => {
  return response.status(500).json({
    statusCode: 500,
    message: "Internal server error",
    error: "Internal Server Error",
  });
};
