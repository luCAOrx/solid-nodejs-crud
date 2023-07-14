import { type Request, type Response } from "express";

export const pageNotFoundError = (
  request: Request,
  response: Response
): Response<any> => {
  return response.status(404).json({
    statusCode: 404,
    message: "Page not found",
    error: "Not Found",
  });
};
