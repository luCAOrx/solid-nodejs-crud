import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import {
  type CompareProps,
  type SignProps,
  type SecurityProvider,
  type HashProps,
} from "@domain/providers/security-provider";

export class UserSecurityProvider implements SecurityProvider {
  async compare({ password, hash }: CompareProps): Promise<boolean> {
    return await compare(password, hash);
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
