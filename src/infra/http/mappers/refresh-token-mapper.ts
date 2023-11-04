import { type RefreshTokenProps } from "@domain/repositories/refresh-token-repository";
import { type RefreshToken as RefreshTokens } from "@prisma/client";

interface ToPersistenceResponse {
  id: string;
  expiresIn: number;
  userId: string;
  createdAt: Date;
}

export class RefreshTokenMapper {
  static toDomain(raw: RefreshTokens): RefreshTokenProps {
    const refreshToken: RefreshTokenProps = {
      id: raw.id,
      expiresIn: raw.expires_in,
      userId: raw.user_id,
      createdAt: raw.created_at,
    };
    return refreshToken;
  }

  static toPersistence({
    id,
    expiresIn,
    userId,
    createdAt,
  }: RefreshTokenProps): ToPersistenceResponse {
    return {
      id,
      expiresIn,
      userId,
      createdAt,
    };
  }
}
