import { CONSTANTS } from '../../lib/constants';
import { OpenApiPath } from '../interfaces/OpenApiPath';

type Operations = typeof CONSTANTS.operations;

export const getDomains = (openApi: OpenApiPath[]): string[] => {
  const domains = new Set<string>();

  openApi.forEach((pathObj) => {
    Object.keys(pathObj).forEach((pathObjKey) => {
      if (CONSTANTS.operations.includes(pathObjKey as Operations[number])) {
        const pathObjValue = pathObj[pathObjKey as Operations[number]];
        let tags = pathObjValue?.tags ?? [];

        if (!domains.has(tags[0])) {
          domains.add(tags[0]);
        }
      }
    });
  });

  return Array.from(domains);
};
