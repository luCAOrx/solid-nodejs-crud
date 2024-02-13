import { notDeepStrictEqual } from "node:assert";
import { describe, before, it } from "node:test";

import { prisma } from "@infra/http/libs/prisma-client";
import { type User } from "@prisma/client";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";

import { deleteUserAfterThirtyMinutes } from "./deleteUserAfterThirtyMinutes";

export function deleteUserAfterThirtyMinutesEndToEndTest(): void {
  describe("Delete user after thirty minutes", () => {
    let user: User;

    before(async () => {
      await new MakeUserFactory().toHttp({}).then(async (response) => {
        const responseBody = await response.json();

        user = responseBody;
      });

      await MakeRequestLoginFactory.execute({
        data: {
          email: "johndoe@example.com",
          password: "1234567890",
        },
      });
    });

    it("should be delete a user and your refresh jwt token after thirty minutes", async () => {
      const currentDate = new Date();

      const advanceTimeByThirtyMinutes = (): Date => {
        const thirtyMinutesAfter = new Date(
          currentDate.getTime() + 30 * 60 * 1000
        );

        return thirtyMinutesAfter;
      };

      advanceTimeByThirtyMinutes();

      await deleteUserAfterThirtyMinutes();

      await prisma.user
        .findFirst({
          where: {
            email: user.email,
          },
        })
        .then((response) => {
          notDeepStrictEqual(response?.role, "COMMON");
        });

      await prisma.refreshToken
        .findFirst({
          where: {
            user_id: user.id,
          },
        })
        .then((response) => {
          notDeepStrictEqual(response?.user_id, user.id);
        });
    });
  });
}
