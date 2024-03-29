const request = require('supertest');
const app = require('../../src/app');

describe('404 Handler', () => {
  test('responds with a 404 error', async () => {
    const response = await request(app).get('/undefined');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });

   
});
test('Health Check Route', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.body.status).toEqual('ok' );
});

 
});
