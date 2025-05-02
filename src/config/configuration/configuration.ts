import * as process from 'process';

export const getConfiguration = () => ({
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ADMIN_LOGIN: process.env.ADMIN_LOGIN,
  ADMIN_PASS: process.env.ADMIN_PASS,
});
