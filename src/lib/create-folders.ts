import { resolve } from "path";

import { mkdir, rmdir } from "./file-system";

export const createFolders = async (outputPath: string) => {
  await rmdir(outputPath);
  await mkdir(outputPath);
  await mkdir(resolve(outputPath, "./base"));
};
