import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { runMigrations } from './database/migrations';

async function bootstrap() {
  // Run migrations before starting the application
  try {
    await runMigrations();
  } catch (error) {
    console.error('Failed to run migrations:', error);
    // You can choose to continue or exit here
  }

  const app = await NestFactory.create(AppModule);

  // Get configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', '/api/v1/');

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Check if there's a global prefix set - if so, remove it or adjust your URL
  // app.setGlobalPrefix('api'); // If this exists, your URL would be /api/auth/register

  // Set up global prefix for all routes
  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
