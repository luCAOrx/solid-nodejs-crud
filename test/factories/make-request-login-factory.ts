import { BASE_URL } from "@test/utils/base-url";

import { MakeRequestFactory } from "./make-request-factory";

interface MakeRequestLoginFactoryProps {
  data: object;
}

export class MakeRequestLoginFactory {
  static async execute({
    data,
  }: MakeRequestLoginFactoryProps): Promise<Response> {
    return await MakeRequestFactory.execute({
      url: `${BASE_URL}/users/authenticate`,
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data,
    });
  }
}
