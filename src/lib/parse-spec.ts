import Parser from "json-schema-ref-parser";

export const parseOpenApiSpec = (path: string): Promise<any> => {
  return Parser.bundle(path, path, {});
};
