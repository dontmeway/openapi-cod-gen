import camelCase from 'camelcase';
import { OpenApiOperation } from '../interfaces/OpenApiOperation';

import type { OpenApiParameter } from '../interfaces/OpenApiParameter';
import type { RequestParams } from './types';

export const getParams = (
  operation: OpenApiOperation | null,
): RequestParams => {
  if (!operation)
    return {
      params: [],
      pathParams: [],
      queryParams: [],
    };

  const allParams = getAllParams(operation.parameters ?? []);

  const queryParams = allParams.filter((param) => param.in === 'query');
  const pathParams = allParams.filter((param) => param.in === 'path');

  return { params: allParams, queryParams, pathParams };
};

const getAllParams = (params: OpenApiParameter[]) =>
  params.map((next) => {
    const paramName = camelCase(next.name);
    const param = {
      in: next.in,
      name: paramName,
      required: next.required === true,
      nullable: next.nullable === true,
      type: getType(next.schema?.type),
      baseName: next.name,
    };

    return param;
  });

const getType = (input: string | string[] | undefined) => {
  if (!input) return 'any';

  let types = input;
  if (!Array.isArray(types)) {
    types = [types];
  }

  return types
    .filter((type) => type !== 'null')
    .map((type) => (type === 'integer' ? 'number' : type))
    .join(' | ');
};
