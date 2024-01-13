export abstract class BaseUseCase<Request, Response> {
  protected abstract execute(request: Request): Promise<Response> | Response;
}
