import { CONSTANTS } from "../../lib/constants";
import { OpenApi } from "../interfaces/OpenApi";
import { OpenApiPath } from "../interfaces/OpenApiPath";

type Request = {
  name: string;
  method: string;
  path: string;
};

type Operations = typeof CONSTANTS.operations;

export const getRequests = (openApi: OpenApi) => {
  let map: Record<string, Request[]> = {};

  Object.keys(openApi.paths).forEach((path) => {
    const pathObj = openApi.paths[path];
    Object.keys(pathObj).forEach((operation) => {
      if (CONSTANTS.operations.includes(operation as Operations[number])) {
        const operationObj = pathObj[operation as Operations[number]];
        const domain = (operationObj?.tags ?? [])[0] ?? "null";
        const request: Request = {
          method: operation.toUpperCase(),
          name: operationObj?.operationId ?? "unknown",
          path: path,
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
