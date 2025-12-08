import request from 'supertest';
import { App } from '../app.js';

describe('Check health test', () => {
  let appInstance;

  beforeEach(() => {
    appInstance = new App();
  })

  test('GET / should return hello message', async () => {
    const response = await request(appInstance._app)
      .get('/')
      .expect(200)
  })

  test('GET /check/health should return 200 status', async () => {
    await request(appInstance._app)
      .get('/check/health')
      .expect(200)
  })

   test('GET /auth/login should return 200 status', async () => {
    await request(appInstance._app)
      .get('/auth/login')
      .expect(200)
  })

   test('GET /auth/register should return 200 status', async () => {
    await request(appInstance._app)
      .get('/auth/register')
      .expect(200)
  })
})

// describe('Test middleware', () => {
//   let appInstance

//   beforeEach(() => {
//     appInstance = new App();
//   })

//   test('GET /user/1 should return 301', async() => {
//     const response = await request(appInstance._app)
//     .get('/user/1')
//     .expect(200)
//   })

//   test('POST /user/delete should return 301', async() => {
//     const response = await request(appInstance._app)
//     .post('/user/delete')
//     .expect(200)
//   })

//   test('POST /user/update should return 301', async() => {
//     const response = await request(appInstance._app)
//     .post('/user/update')
//     .expect(200)
//   })
// })
