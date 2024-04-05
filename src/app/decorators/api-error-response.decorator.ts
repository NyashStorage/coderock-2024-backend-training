import { ApiResponse } from '@nestjs/swagger';
import type { HttpStatus } from '@nestjs/common';

export default function ApiErrorResponse(
  status: HttpStatus,
  message: string,
): MethodDecorator {
  return ApiResponse({
    description: message,
    status,
  });
}
