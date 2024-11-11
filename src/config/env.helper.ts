import * as fs from 'fs';
import * as path from 'path';

export function getEnvFilePaths(): string[] {
  const env = process.env.NODE_ENV || 'development';

  const envFiles = [`.env.${env}.local`, `.env.${env}`, '.env'];

  // Filter out the files that do not exist
  const existingEnvFiles = envFiles.filter((file) => {
    const filePath = path.resolve(process.cwd(), file);
    return fs.existsSync(filePath);
  });

  return existingEnvFiles;
}
