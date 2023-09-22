export interface RefreshTokenProps {
  id: string;
  expiresIn: number;
  userId: string;
  createdAt: Date;
}

export abstract class RefreshTokenRepository {
  abstract create(refreshToken: RefreshTokenProps): Promise<RefreshTokenProps>;
  abstract findById(id: string): Promise<RefreshTokenProps | null>;
  abstract delete(id: string): Promise<void>;
}
