import { OpenApi } from "../interfaces/OpenApi";
import { getDomains } from "./get-domains";
import { getRequests } from "./get-request";

export const parser = (openApi: OpenApi) => {
  const domains = getDomains(Object.values(openApi.paths));
  const requests = getRequests(openApi);

  return {
    domains,
    requests,
  };
};
