import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    //tutte le porte solo in sviluppo
    origin: true, credentials: true,
  });

  await app.listen(3000);
}
bootstrap();