export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string = "internal_error",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }

  static notFound(message = "Recurso não encontrado") {
    return new HttpError(404, message, "not_found");
  }

  static badRequest(message = "Requisição inválida", details?: unknown) {
    return new HttpError(400, message, "bad_request", details);
  }
}
