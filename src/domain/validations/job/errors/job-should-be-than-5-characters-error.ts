export class JobShouldBeThan5CharactersError extends Error {
  constructor() {
    super("The field job should be than 5 characters");
    this.name = "JobShouldBeThan5CharactersError";
  }
}
