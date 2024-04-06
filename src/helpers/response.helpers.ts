import type { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';

export function setHeader(
  response: FastifyReply | ServerResponse,
  header: string,
  value: string,
): void {
  if (response instanceof ServerResponse) response.setHeader(header, value);
  else response.header(header, value);
}
