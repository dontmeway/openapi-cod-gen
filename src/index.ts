import { resolve } from "path";

import { mkdir, writeFile } from "./lib/file-system";
import { parseOpenApiSpec } from "./lib/parse-spec";
import { createFolders } from "./lib/create-folders";
import { parser } from "./open-api";
import { registerHandleBars } from "./lib/register-handlebars";

type Generate = {
  input: string;
  output: string;
};

const generate = async ({ input, output }: Generate) => {
  const openApi = typeof input === "string" ? await parseOpenApiSpec(input) : input;
  const outputPath = resolve(process.cwd(), output);
  const { configFile, baseRequestFile, domainRequestFile } = registerHandleBars();

  const { domains, requests } = parser(openApi);

  await createFolders(outputPath);

  await writeFile(resolve(outputPath, "./base", "index.ts"), baseRequestFile({}));
  await writeFile(resolve(outputPath, "./base", "config.ts"), configFile({}));

  for (const [domain, domainRequests] of Object.entries(requests)) {
    await mkdir(resolve(outputPath, "./domains", domain));
    for (const request of domainRequests) {
      const path = resolve(outputPath, `./${domain}`, "index.ts");
      await writeFile(
        resolve(outputPath, `./domains/${domain}`, "index.ts"),
        domainRequestFile(request)
      );
    }
  }
};

export default { generate };
