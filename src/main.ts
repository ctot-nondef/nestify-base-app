import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { UserModule } from './user/user.module';
import { SchemasModule } from './schemas/schemas.module';
import { AssetsModule } from './assets/assets.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/v${process.env.API_VERSION}`);
  app.enableCors({
    origin: ['https://10.4.24.253:8080'],
    credentials: true,
    exposedHeaders: ['X-Total-Count'],
  });

  const options = new DocumentBuilder()
    .setTitle(app.get('ConfigService').get('meta.title'))
    .setDescription(app.get('ConfigService').get('meta.description'))
    .setVersion(process.env.API_VERSION)
    .addBearerAuth({type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}, 'bearer')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [
      UserModule,
      SchemasModule,
      AssetsModule,
    ],
  });

  app.get('SchemasService').addSwaggerDefs(document);
  SwaggerModule.setup(`api/v${process.env.API_VERSION}/swagger`, app, document);

  await app.listen(process.env.APP_PORT).then(() => {
    console.log('listening');
  });
}

bootstrap();
