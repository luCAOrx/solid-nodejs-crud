import { sign } from "jsonwebtoken";

export class GenerateTokenProvider {
  static execute(params: object): string {
    return sign(params, String(process.env.JWT_SECRET), {
      expiresIn: "20s",
    });
  }
}
