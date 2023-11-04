import { randomUUID, createHmac, randomBytes, pbkdf2 } from "node:crypto";

import {
  type CompareProps,
  type SecurityProvider,
  type HashProps,
  type SignProps,
} from "@domain/providers/security-provider";
import { type RefreshTokenProps } from "@domain/repositories/refresh-token-repository";

export class UserSecurityProvider implements SecurityProvider {
  async refreshToken(userId: string): Promise<RefreshTokenProps> {
    const fifteenSecondsInUnixTimestamp = new Date().getTime() / 1000 + 15;

    const refreshToken = {
      id: randomUUID(),
      expiresIn: fifteenSecondsInUnixTimestamp,
      userId,
      createdAt: new Date(),
    };

    return refreshToken;
  }

  async compare({ password, hashedPassword }: CompareProps): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      const [salt, hash] = hashedPassword.split(".");

      pbkdf2(
        password,
        Buffer.from(salt, "base64"),
        10000,
        64,
        "sha512",
        (hashErr, derivedKey) => {
          if (hashErr != null) {
            reject(hashErr);
            return;
          }

          const computedHash = derivedKey.toString("base64");
          resolve(computedHash === hash);
        }
      );
    });
  }

  sign({ payload, secretOrPrivateKey, expiresIn }: SignProps): string {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      "base64"
    );

    const currentTime = Math.floor(Date.now() / 1000);
    const payloadWithExp = {
      ...payload,
      unique: currentTime,
      exp: currentTime + (Number(expiresIn) ?? 0),
    };
    const encodedPayload = Buffer.from(JSON.stringify(payloadWithExp)).toString(
      "base64"
    );

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = createHmac("sha256", secretOrPrivateKey)
      .update(signatureInput)
      .digest("base64");

    const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    return token;
  }

  async hash({ password, salt }: HashProps): Promise<string> {
    return await new Promise((resolve, reject) => {
      randomBytes(salt, (err, salt) => {
        if (err != null) {
          reject(err);
          return;
        }

        pbkdf2(password, salt, 10000, 64, "sha512", (hashErr, derivedKey) => {
          if (hashErr != null) {
            reject(hashErr);
            return;
          }

          const saltString = salt.toString("base64");
          const hashString = derivedKey.toString("base64");

          resolve(`${saltString}.${hashString}`);
        });
      });
    });
  }
}
