import { type RefreshTokenProps } from "@domain/repositories/refresh-token-repository";

export interface CompareProps {
  password: string;
  hashedPassword: string;
}

export interface SignProps {
  payload: { id: string };
  secretOrPrivateKey: string;
  expiresIn?: string | number | undefined;
}

export interface HashProps {
  password: string;
  salt: number;
}

export abstract class SecurityProvider {
  abstract compare(params: CompareProps): Promise<boolean>;
  abstract sign(params: SignProps): string;
  abstract hash(params: HashProps): Promise<string>;
  abstract refreshToken(userId: string): Promise<RefreshTokenProps>;
}
