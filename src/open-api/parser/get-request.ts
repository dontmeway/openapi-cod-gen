import camelCase from 'camelcase';
import kebabCase from 'just-kebab-case';

import { CONSTANTS } from '../../lib/constants';
import { OpenApi } from '../interfaces/OpenApi';
import { OpenApiPath } from '../interfaces/OpenApiPath';

import { getParams } from './get-params';
import { getRequestBody } from './get-request-body';
import type { Request, RequestImport } from './types';

type Operations = typeof CONSTANTS.operations;

export const getRequests = (openApi: OpenApi) => {
  let map: Record<
    string,
    { requests: Request[]; imports: Record<string, RequestImport> }
  > = {};

  Object.keys(openApi.paths).forEach((path) => {
    const pathObj = openApi.paths[path];
    Object.keys(pathObj).forEach((operation) => {
      if (CONSTANTS.operations.includes(operation as Operations[number])) {
        const operationObj = pathObj[operation as Operations[number]] ?? null;
        const domain = (operationObj?.tags ?? [])[0] ?? 'null';
        const params = getParams(operationObj);

        const requestBody = getRequestBody(operationObj?.requestBody ?? null);

        if (requestBody) {
          params.params.push(requestBody);
        }

        const request: Request = {
          method: operation.toUpperCase(),
          name: camelCase(operationObj?.operationId ?? 'unknown'),
          path,
          params,
          paramsTypeName: camelCase(operationObj?.operationId ?? 'unknown', {
            pascalCase: true,
          }),
          requestBody: requestBody?.name ?? null,
        };
        let requests: Request[] = [];
        let imports: Record<string, RequestImport> = {};
        if (map[domain]) {
          const domainRequests = map[domain].requests ?? [];
          const domainImports = map[domain].imports ?? {};
          requests = domainRequests;
          imports = domainImports;
        }

        if (requestBody) {
          imports = {
            ...imports,
            [requestBody.type]: {
              from: kebabCase(requestBody.type),
              name: requestBody.type,
            },
          };
        }

        requests.push(request);
        map = { ...map, [domain]: { imports, requests } };
      }
    });
  });

  return map;
};
