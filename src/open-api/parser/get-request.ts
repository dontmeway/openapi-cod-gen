import camelCase from "camelcase";

import { CONSTANTS } from "../../lib/constants";
import { OpenApi } from "../interfaces/OpenApi";
import { OpenApiPath } from "../interfaces/OpenApiPath";

import { getParams } from "./get-params";
import { Request } from "./types";

type Operations = typeof CONSTANTS.operations;

export const getRequests = (openApi: OpenApi) => {
  let map: Record<string, Request[]> = {};

  Object.keys(openApi.paths).forEach((path) => {
    const pathObj = openApi.paths[path];
    Object.keys(pathObj).forEach((operation) => {
      if (CONSTANTS.operations.includes(operation as Operations[number])) {
        const operationObj = pathObj[operation as Operations[number]] ?? null;
        const domain = (operationObj?.tags ?? [])[0] ?? "null";
        const request: Request = {
          method: operation.toUpperCase(),
          name: camelCase(operationObj?.operationId ?? "unknown"),
          path: path,
          params: getParams(operationObj?.parameters ?? []),
          paramsTypeName: camelCase(operationObj?.operationId ?? "unknown", { pascalCase: true }),
        };
        let requests: Request[] = [];
        if (map[domain]) {
          const domainRequests = map[domain] ?? [];
          requests = domainRequests;
        }
        requests.push(request);
        map = { ...map, [domain]: requests };
      }
    });
  });

  return map;
};
