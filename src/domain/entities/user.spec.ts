import { Email } from "./email";
import { Job } from "./job";
import { Name } from "./name";
import { Password } from "./password";
import { User } from "./user";

const name = Name.create("Lucas").value as unknown as Name;
const job = Job.create("Development").value as unknown as Job;
const email = Email.create("lucas@example.com").value as unknown as Email;
const password = Password.create("1234567890").value as unknown as Password;

describe("User model", () => {
  it("should be able to create a new user", () => {
    const userOrError = User.create({
      name,
      job,
      email,
      password,
    });

    expect(userOrError).toBeTruthy();
    expect(userOrError).toStrictEqual(userOrError);
  });
});
