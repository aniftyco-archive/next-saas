import { Request, Response } from './api-handler';

export class APIError<Data extends {} = Record<string, any>> extends Error {
  constructor(message: string, private statusCode: number, private type: string, private data?: Data) {
    super(message);
  }

  render(req: Request<any, any, any>, res: Response<any>) {
    const response = {
      message: this.message,
      type: this.type,
      data: undefined,
    };

    if (this.data) {
      response.data = this.data;
    }

    return res.status(this.statusCode).send(response);
  }
}

export class InternalServerError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Internal Server Error', 500, type || 'E_INTERNAL_SERVER_ERROR', data);
  }
}

export class NotFoundError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Not Found', 404, type || 'E_NOT_FOUND', data);
  }
}

export class MethodNotAllowed<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Method Not Allowed', 405, type || 'E_METHOD_NOT_ALLOWED', data);
  }
}

export class UnauthorizedError<Data> extends APIError<Data> {
  constructor(message?: string, type?: string, data?: Data) {
    super(message || 'Unauthorized', 401, type || 'E_UNAUTHORIZED', data);
  }
}
