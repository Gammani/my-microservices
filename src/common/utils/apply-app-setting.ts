import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../exception-filters/http-exception-filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../../app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const applyAppSettings = (app: INestApplication) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  setAppPipes(app);
  setAppExceptionFilters(app);

  app.enableCors();
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Документация API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT-auth',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
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
