import { config as dotenvConfig } from 'dotenv';

import { getEnvFilePaths } from './env.helper';
export { getEnvFilePaths } from './env.helper';

const envFilePaths = getEnvFilePaths();
for (const envFilePath of envFilePaths) {
  dotenvConfig({ path: envFilePath });
}

export { default as redis } from './redis';
