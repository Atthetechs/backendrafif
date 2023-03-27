import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Setting for hbs file
  app.useStaticAssets(join(__dirname, '../views'));
  app.setBaseViewsDir(join(__dirname, '../views'));
  app.setViewEngine('hbs');

  // app.enableCors();

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
