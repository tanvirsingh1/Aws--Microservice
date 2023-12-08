// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('Delete /v1/fragments', () => {
  let fragmentId;

  // If the request is missing the Authorization header, it should be forbidden
  test('authenticated users post a fragments array with a supported type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('Testing');

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.status).toBe('ok');

    fragmentId = JSON.parse(postRes.text).fragments.id;
  });

  test('user trying to delete the fragment', async () => {
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(200);
  });

  test('user trying to delete invalid fragment', async () => {
    const deleteRes = await request(app)
      .delete(`/v1/fragments/invalidId`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(404);
  });
});
