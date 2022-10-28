import type { OpenApiRequestBody } from '../interfaces/OpenApiRequestBody';
import type { Param } from './types';

export const getRequestBody = (
  openApiRequestBody: OpenApiRequestBody | null,
): Param | null => {
  if (!openApiRequestBody) return null;

  const content = openApiRequestBody.content;
  const applicationJson = content['application/json'];

  if (!applicationJson) return null;

  const ref = `${applicationJson.schema?.$ref}`.split('/').at(-1) ?? 'unknown';

  return {
    baseName: 'requestBody',
    in: 'body',
    name: 'requestBody',
    nullable: false,
    required: openApiRequestBody.required === true,
    type: ref,
  };
};
