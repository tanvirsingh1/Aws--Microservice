const request = require('supertest');
const app = require('../../src/app');

test('Internal server Error', async () => {
    const response = await request(app).get(`/v1/fragments/tanvir`).auth('user1@email.com', 'password1');
    expect(response.status).toBe(500);
   
  });
  