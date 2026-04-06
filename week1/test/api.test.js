const request = require('supertest');
const app = require('../app');

describe('API Health Checks', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('OK');
  });

  it('POST /order without body should return 400 Bad Request', async () => {
    const res = await request(app).post('/order').send({});
    expect(res.statusCode).toEqual(400);
  });
});
