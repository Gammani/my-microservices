import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './common/utils/apply-app-setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyAppSettings(app);
  await app.listen(process.env.PORT || 3000);

  console.log(`app listen the PORT: ${process.env.PORT}`);
}
bootstrap();
