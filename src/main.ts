import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;
  Logger.log('SWAPI LS API starting...')
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .addTag('nestjs') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
  });
  await app.listen(port);
  Logger.log(`SWAPI LS API running on port: ${port}`)

}
bootstrap();
