import { type SecurityProvider } from "@domain/providers/security-provider";

interface GenerateJwtTokenProps {
  payload: { id: string };
}

export class GenerateJwtToken {
  constructor(private readonly securityProvider: SecurityProvider) {}

  public execute({ payload }: GenerateJwtTokenProps): string {
    const token = this.securityProvider.sign({
      payload,
      secretOrPrivateKey: String(process.env.JWT_SECRET),
      expiresIn: "15s",
    });

    return token;
  }
}
