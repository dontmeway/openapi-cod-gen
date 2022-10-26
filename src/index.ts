import Handlebars from "handlebars";
import { resolve } from "path";

import { writeFile, mkdir, rmdir } from "./lib/file-system";
import { parseOpenApiSpec } from "./lib/parse-spec";
import requestTemplate from "./templates/base/request.hbs";
import configTemplate from "./templates/base/config.hbs";

type Generate = {
  input: string;
  output: string;
};

const generate = async ({ input, output }: Generate) => {
  const openApi = typeof input === "string" ? await parseOpenApiSpec(input) : input;

  const outputPath = resolve(process.cwd(), output);
  await rmdir(outputPath);
  await mkdir(outputPath);
  await mkdir(`${outputPath}/base`);

  const requestFile = Handlebars.template(requestTemplate);
  const configFile = Handlebars.template(configTemplate);
  await writeFile(resolve(`${outputPath}/base`, "request.ts"), requestFile({}));
  await writeFile(
    resolve(`${outputPath}/base`, "config.ts"),
    configFile({ baseUrl: "https://api.medhub.uz", version: 1 })
  );
};

export default { generate };
