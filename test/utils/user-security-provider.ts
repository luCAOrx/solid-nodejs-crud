import {
  type CompareProps,
  type SignProps,
  type SecurityProvider,
  type HashProps,
} from "@domain/providers/security-provider";

export class UserSecurityProvider implements SecurityProvider {
  async compare({ password, hash }: CompareProps): Promise<boolean> {
    if (password === hash) return true;

    return false;
  }

  sign({ payload, secretOrPrivateKey, expiresIn }: SignProps): string {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  }

  async hash({ password, salt }: HashProps): Promise<string> {
    return "ea5b3306fc0aad6abdcaecc71b625caf09b2c80ab0d25d350fa89d781d8002a6ad";
  }
}
