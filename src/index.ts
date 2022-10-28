import { resolve } from 'path';

import { mkdir, writeFile } from './lib/file-system';
import { parseOpenApiSpec } from './lib/parse-spec';
import { createFolders } from './lib/create-folders';
import { parser } from './open-api';
import { registerHandleBars } from './lib/register-handlebars';
import { formatCode, formatIndentation } from './lib/format';

type Generate = {
  input: string;
  output: string;
};

const generate = async ({ input, output }: Generate) => {
  const openApi =
    typeof input === 'string' ? await parseOpenApiSpec(input) : input;
  const outputPath = resolve(process.cwd(), output);
  const { configFile, baseRequestFile, domainRequestFile, modelFile } =
    registerHandleBars();

  const { domains, requests, models } = parser(openApi);

  await createFolders(outputPath);

  await writeFile(
    resolve(outputPath, './base', 'index.ts'),
    baseRequestFile({}),
  );
  await writeFile(resolve(outputPath, './base', 'config.ts'), configFile({}));

  for (const [domain, domainEntries] of Object.entries(requests)) {
    await mkdir(resolve(outputPath, './domains', domain));
    const template = domainRequestFile({
      requests: domainEntries.requests,
      imports: Object.values(domainEntries.imports),
    });

    await writeFile(
      resolve(outputPath, `./domains/${domain}`, 'index.ts'),
      formatIndentation(formatCode(template)),
    );
  }

  await mkdir(resolve(outputPath, './models'));
  for (const [modelName, model] of Object.entries(models)) {
    const template = modelFile(model);

    await writeFile(
      resolve(outputPath, './models', `${modelName}.ts`),
      formatIndentation(formatCode(template)),
    );
  }
};

export default { generate };
