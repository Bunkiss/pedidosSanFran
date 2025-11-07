import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003','http://localhost:3004'], // el puerto donde corre tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // si usás cookies o auth headers
  });

  await app.listen(3000);
  console.log('🚀 Backend corriendo en http://localhost:3000');
}
bootstrap();
