import {
  type RefreshTokenProps,
  type RefreshTokenRepository,
} from "@domain/repositories/refresh-token-repository";

import { prisma } from "../libs/prisma-client";
import { RefreshTokenMapper } from "../mappers/refresh-token-mapper";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async exists(userId: string): Promise<boolean> {
    const refreshTokenAlreadyExists = await prisma.refreshToken.findUnique({
      where: { user_id: userId },
    });

    return !(refreshTokenAlreadyExists === null);
  }

  async create(refreshToken: RefreshTokenProps): Promise<RefreshTokenProps> {
    const { id, expiresIn, userId, createdAt } =
      RefreshTokenMapper.toPersistence(refreshToken);

    const createdRefreshToken = await prisma.refreshToken.create({
      data: {
        id,
        expires_in: expiresIn,
        user_id: userId,
        created_at: createdAt,
      },
    });

    return RefreshTokenMapper.toDomain(createdRefreshToken);
  }

  async findById(id: string): Promise<RefreshTokenProps | null> {
    const refreshTokenOrNull = await prisma.refreshToken.findUnique({
      where: { id },
    });

    if (refreshTokenOrNull === null) return null;

    return RefreshTokenMapper.toDomain(refreshTokenOrNull);
  }

  async delete(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { user_id: id },
    });
  }
}
