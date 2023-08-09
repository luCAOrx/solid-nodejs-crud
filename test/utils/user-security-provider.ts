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
    return "1234567890";
  }
}
