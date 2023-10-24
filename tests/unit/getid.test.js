
const request = require('supertest');

const app = require('../../src/app');


describe('GetByID /v1/fragments', () => {

    test('Split Id with right extension', async() =>{
        const response = await request(app).get('/v1/fragments/12345.txt').auth('user1@email.com', 'password1');
        expect(response.status).not.toBe(415);
    })
    test('Split Id with wrong extension', async() =>{
        const response = await request(app).get('/v1/fragments/12345.html').auth('user1@email.com', 'password1');
        expect(response.status).toBe(415);
    })
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));
  
    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', () =>
      request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));
  
   
    test('authenticated users get a fragments array with Incorrect ID', async () => {
     var id = 1; 
      const res = await request(app).get(`/v1/fragments${id}`).auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
     // expect(res.body.message).toBe('Not found id or not a plain text fragment')
   
    });
    test('authenticated users get a fragments array with Correct ID', async () => {
        const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('content-type', 'text/plain')
        .send("This is data");
    
        var id = JSON.parse(res.text).fragments.id;
       const res2 = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
        // const res = await request(app).get(`/v1/fragments${id}`).auth('user1@email.com', 'password1');
         expect(res2.statusCode).toBe(200);
        // expect(res.body.message).toBe('Not found id or not a plain text fragment')
      
       });
    
  });