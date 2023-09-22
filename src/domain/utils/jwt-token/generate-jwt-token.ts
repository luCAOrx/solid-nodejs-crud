import { type SecurityProvider } from "@domain/providers/security-provider";

interface GenerateJwtTokenProps {
  payload: string;
}

export class GenerateJwtToken {
  constructor(private readonly securityProvider: SecurityProvider) {}

  public execute({ payload }: GenerateJwtTokenProps): string {
    if (payload === null) throw new Error("Id is a required param");

    const jwtToken = this.securityProvider.sign({
      payload: { id: payload },
      secretOrPrivateKey: String(process.env.JWT_SECRET),
      expiresIn: "20s",
    });

    return jwtToken;
  }
}
