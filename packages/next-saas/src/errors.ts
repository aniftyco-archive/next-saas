import { Request, Response } from './api-handler';

export class APIError<Data extends {} = Record<string, any>> extends Error {
  constructor(message: string, private statusCode: number, private type: string, private data?: Data) {
    super(message);
  }

  render(req: Request<any, any, any>, res: Response<any>) {
    const response = {
      message: this.message,
      type: this.type,
      ...(this.data && this.data),
    };

    return res.status(this.statusCode).send(response);
  }
}

export class BadRequestError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Bad Request', 400, type || 'E_BAD_REQUEST', data);
  }
}

export class UnauthorizedError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Unauthorized', 401, type || 'E_UNAUTHORIZED', data);
  }
}

export class NotFoundError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Not Found', 404, type || 'E_NOT_FOUND', data);
  }
}

export class MethodNotAllowedError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Method Not Allowed', 405, type || 'E_METHOD_NOT_ALLOWED', data);
  }
}

export class ValidationError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Unprocessable Entity', 422, type || 'E_UNPROCESSABLE_ENTITY', data);
  }
}

export class InternalServerError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Internal Server Error', 500, type || 'E_INTERNAL_SERVER_ERROR', data);
  }
}
