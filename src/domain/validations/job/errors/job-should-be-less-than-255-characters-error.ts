export class JobShouldBeLessThan255CharactersError extends Error {
  constructor() {
    super("The field job should be less than 255 characters");
    this.name = "JobShouldBeLessThan255CharactersError";
  }
}
