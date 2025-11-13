import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) debería crear un usuario nuevo', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        nombre: 'Usuario E2E',
        email: 'e2e@test.com',
        contraseña: '123456',
        rol: 'driver',
      })
      .expect(201);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.user.email).toBe('e2e@test.com');
    expect(res.body).toHaveProperty('token');
  });

  it('/auth/login (POST) debería loguear el usuario', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'e2e@test.com',
        contraseña: '123456',
      })
      .expect(201);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });
});
