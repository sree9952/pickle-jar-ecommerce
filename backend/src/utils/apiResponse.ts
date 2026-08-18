import { Response } from 'express';

export interface ApiResponsePayload<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode = 200,
    meta?: Record<string, any>
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.success(res, message, data, 201);
  }

  static paginated<T>(
    res: Response,
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number
  ): Response {
    const totalPages = Math.ceil(total / limit);
    return ApiResponse.success(res, message, data, 200, {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  }
}
