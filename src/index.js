import JsonSchemaRefParser from "@apidevtools/json-schema-ref-parser";
import Handlebars from "handlebars";
import { resolve } from "path";

import { writeFile, mkdir, rmdir } from "./lib/file-system";
import requestTemplate from "./templates/base.hbs";

const generate = async ({ input, output }) => {
  const openApi =
    typeof input === "string" ? await JsonSchemaRefParser.bundle(input, input, {}) : input;

  const outputPath = resolve(process.cwd(), output);

  await rmdir(outputPath);
  await mkdir(outputPath);

  const result = Handlebars.template(requestTemplate);
  await writeFile(resolve(outputPath, "base.js"), result({}));
};

export const OpenApi = { generate };
