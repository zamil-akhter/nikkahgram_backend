import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const moduleConfigurations: any = {
    cors: false,
    rawBody: true
  };
  const app = await NestFactory.create(AppModule);

  // Get ConfigService
  const configService = app.get(ConfigService);

  app.enableCors({ origin: '*' });
  // checking swagger enable
  const swaggerEnabled = configService.get<string>('SWAGGER_ENABLE') === 'true';
  if (swaggerEnabled) {
    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('NikkahGram API Documentation')
      .setDescription('NikkahGram API Description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
      jsonDocumentUrl: 'docs/json',
    });
  }

  // global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // listening on port
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);

  swaggerEnabled
    ? logger.debug(`📚 Swagger Documentation at: http://localhost:${port}/docs`)
    : logger.debug('Swagger Documentation is disabled');
  logger.debug(`✅ Server is up and running at port: ${port}`);
}
bootstrap();
