import request from 'supertest';
import { App } from '../app.js';

describe('Check health test', () => {
  let appInstance;

  beforeEach(() => {
    appInstance = new App();
  });

  test('GET / should return hello message', async () => {
    const response = await request(appInstance._app)
      .get('/')
      .expect(200);
    
    expect(response.body).toHaveProperty('msg');
    expect(response.body.msg).toBe('HELLO FROM SERVER');
  });

  test('GET /check/health should return 200 status', async () => {
    await request(appInstance._app)
      .get('/check/health')
      .expect(200);
  });

   test('GET /auth/login should return 200 status', async () => {
    await request(appInstance._app)
      .get('/auth/login')
      .expect(200);
  });

   test('GET /auth/register should return 200 status', async () => {
    await request(appInstance._app)
      .get('/auth/register')
      .expect(200);
  });
});