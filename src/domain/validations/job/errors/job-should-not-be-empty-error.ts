export class JobShouldNotBeEmptyError extends Error {
  constructor() {
    super("The field job should not be empty");
    this.name = "JobShouldNotBeEmptyError";
  }
}
