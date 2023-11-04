import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import {
  type CompareProps,
  type SignProps,
  type SecurityProvider,
  type HashProps,
} from "@domain/providers/security-provider";
import { type RefreshTokenProps } from "@domain/repositories/refresh-token-repository";
import { GenerateRefreshToken } from "@domain/utils/refresh-token/generate-refresh-jwt-token";

import { PrismaRefreshTokenRepository } from "../repositories/prisma-refresh-token-repository";
import { PrismaUserRepository } from "../repositories/prisma-user-repository";

export class UserSecurityProvider implements SecurityProvider {
  async refreshToken(userId: string): Promise<RefreshTokenProps> {
    const prismaRefreshTokenRepository = new PrismaRefreshTokenRepository();
    const prismaUserRepository = new PrismaUserRepository();
    const generateRefreshToken = new GenerateRefreshToken(
      prismaRefreshTokenRepository,
      prismaUserRepository
    );

    const { refreshToken } = await generateRefreshToken.execute({ userId });

    return refreshToken;
  }

  async compare({ password, hashedPassword }: CompareProps): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  sign({ payload, secretOrPrivateKey, expiresIn }: SignProps): string {
    return sign(payload, secretOrPrivateKey, {
      expiresIn,
    });
  }

  async hash({ password, salt }: HashProps): Promise<string> {
    return await hash(password, salt);
  }
}
