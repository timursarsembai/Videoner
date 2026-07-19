import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS with API key support
  app.enableCors({
    origin: (
      origin: string,
      callback: (error: Error | null, success?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps, Postman, or curl requests)
      if (!origin) {
        callback(null, true);
        return;
      }

      try {
        const originUrl = new URL(origin);

        // In development, allow localhost and local network
        if (process.env.NODE_ENV !== 'production') {
          const devAllowed = [
            'localhost',
            '127.0.0.1',
            '192.168.',
            '10.',
            'null',
          ];
          if (devAllowed.some((host) => originUrl.hostname.includes(host))) {
            callback(null, true);
            return;
          }
        }

        // In production, check against allowed origins
        const allowedOrigins =
          process.env.ALLOWED_ORIGINS?.split(',')
            .map((o) => o.trim())
            .filter(Boolean) || [];

        // Always allow the main domain
        allowedOrigins.push('vidyoza.com', 'www.vidyoza.com');

        if (
          allowedOrigins.some((domain) => originUrl.hostname.endsWith(domain))
        ) {
          callback(null, true);
        } else {
          callback(new Error('Domain not allowed by CORS'), false);
        }
      } catch {
        callback(new Error('Invalid origin'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: [
      'Content-Disposition',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    credentials: true,
    maxAge: 3600, // Cache preflight requests for 1 hour
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Configure Swagger with security
  const config = new DocumentBuilder()
    .setTitle('YouTube Downloader API')
    .setDescription('API for downloading and managing YouTube videos')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description:
          'API key for authentication. Can also be provided via Bearer token in Authorization header.',
      },
      'X-API-Key',
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'API Key',
      description:
        'API key as Bearer token. Can also be provided via X-API-Key header.',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Only enable Swagger UI in development environment
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
