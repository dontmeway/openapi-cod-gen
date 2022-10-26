import Parser from "json-schema-ref-parser";

export const parseOpenApiSpec = (path: string) => {
  return Parser.bundle(path, path, {});
};
