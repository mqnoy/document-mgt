import 'dotenv/config';

const config = {
  app: {
    port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000,
    logLevels: process.env.LOG_LEVELS
      ? process.env.LOG_LEVELS.split(',')
      : ['error'],
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret123',
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY
      ? Number(process.env.JWT_ACCESS_TOKEN_EXPIRY)
      : 86400, // default 1day
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY
      ? Number(process.env.JWT_REFRESH_TOKEN_EXPIRY)
      : 604800, // default 7day
  },
  minio: {
    server: process.env.MINIO_SERVER || 'localhost',
    port: Number(process.env.MINIO_PORT) || 9000,
    ssl: process.env.MINIO_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
    bucket: process.env.MINIO_BUCKET || 'document-management',
  },
};

export default config;
