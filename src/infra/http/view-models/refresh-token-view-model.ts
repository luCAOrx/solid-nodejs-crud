import { type RefreshTokenProps } from "@domain/repositories/refresh-token-repository";

export interface ToHttpResponse {
  id?: string;
  expiresIn?: number;
  userId?: string;
}

export class RefreshTokenViewModel {
  static toHttp(refreshToken: RefreshTokenProps | undefined): ToHttpResponse {
    return {
      id: refreshToken?.id,
      expiresIn: refreshToken?.expiresIn,
      userId: refreshToken?.userId,
    };
  }
}
