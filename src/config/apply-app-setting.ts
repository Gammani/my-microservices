import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exception-filters/http-exception-filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import * as cookieParser from 'cookie-parser';

// Используем данную функцию в main.ts и в e2e тестах
export const applyAppSettings = (app: INestApplication) => {
  // для кастомных декораторов
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // глобальные настройки
  setAppPipes(app);
  setAppExceptionFilters(app);

  app.enableCors();
  app.use(cookieParser());
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsForResponse: { message: string; field: string }[] = [];

        errors.forEach((e) => {
          if (e.constraints) {
            for (const key in e.constraints) {
              errorsForResponse.push({
                message: e.constraints[key],
                field: e.property,
              });
            }
          }
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
};

const setAppExceptionFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
