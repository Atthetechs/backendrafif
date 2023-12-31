import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,PATCH,DELETE',
    credentials: true,
  });

  // use for images size
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Setting for hbs file
  app.useStaticAssets(join(__dirname, '../views'));
  app.setBaseViewsDir(join(__dirname, '../views'));
  app.setViewEngine('hbs');

  // Swagger Setting
  const config = new DocumentBuilder()
    .setTitle('All API For Test')
    .setDescription('API description')
    .setVersion('1.0')
    // .addTag('API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5001);
  console.log('server is running on 5001');
}
bootstrap();
