import { registerAs } from '@nestjs/config';

let tlsOptions: any = undefined;
if (process.env.NODE_ENV === 'production') {
  if (process.env.REDIS_CA_CERT) {
    tlsOptions = {
      ca: process.env.REDIS_CA_CERT,
      rejectUnauthorized: true,
    };
  } else {
    tlsOptions = { rejectUnauthorized: true }; // Use with caution
  }
}

export const rawConfig = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: tlsOptions,
};

console.log('rawConfig:', rawConfig);

export default registerAs('redis', () => rawConfig);
