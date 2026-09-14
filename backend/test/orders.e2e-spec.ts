import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Orders flow (e2e)', () => {
  let app: INestApplication;
  let customerId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/customers?workspaceId=1')
      .send({ name: 'CI Test Customer', email: `ci-${Date.now()}@example.com` })
      .expect(201);

    customerId = res.body.id;
    expect(customerId).toBeDefined();
  });

  it('creates a product', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/products?workspaceId=1')
      .send({ name: 'CI Test Product', price: 25.5 })
      .expect(201);

    productId = res.body.id;
    expect(productId).toBeDefined();
  });

  it('creates an order and calculates the correct total', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/orders?workspaceId=1')
      .send({ customerId, items: [{ productId, quantity: 3 }] })
      .expect(201);

    orderId = res.body.id;
    expect(res.body.status).toBe('pending');
    expect(Number(res.body.totalAmount)).toBe(76.5); // 25.50 * 3
  });

  it('rejects an order with no items', async () => {
    await request(app.getHttpServer())
      .post('/api/orders?workspaceId=1')
      .send({ customerId, items: [] })
      .expect(400);
  });

  it('transitions pending -> completed successfully', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}/status?workspaceId=1`)
      .send({ status: 'completed' })
      .expect(200);

    expect(res.body.status).toBe('completed');
  });

  it('rejects reopening a completed order', async () => {
    await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}/status?workspaceId=1`)
      .send({ status: 'pending' })
      .expect(400);
  });
});