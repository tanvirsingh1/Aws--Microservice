
const request = require('supertest');

const app = require('../../src/app');


describe('GET /fragments/:id/info', () => {
    test('should return a fragment-metadata when a valid ID is provided', async () => {
        const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('content-type', 'text/plain')
        .send("This is data");
    
        var id = JSON.parse(res.text).fragments.id;
        const res2 = await request(app).get(`/v1/fragments/${id}/info`).auth('user1@email.com', 'password1');
        expect(res2.body).toHaveProperty('fragment');

    });
  
    it('should return a 404 error when an invalid ID is provided', async () => {
    
    
      const response = await request(app).get(`/v1/fragments/1234/info`).auth('user1@email.com', 'password1'); 
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Fragment not Found');

    });
  });