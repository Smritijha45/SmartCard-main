import request from 'supertest';
import app from '../src/app';

describe('Root and Routing Endpoints', () => {
  it('GET / should return 200 with healthy API status', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'SmartCard API is running',
      status: 'healthy'
    });
  });

  it('GET /genuinely-nonexistent-route should return 404 with NOT_FOUND error JSON', async () => {
    const res = await request(app).get('/genuinely-nonexistent-route');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested endpoint does not exist'
      }
    });
  });

  it('GET /api/billing/plans should remain registered and accessible', async () => {
    const res = await request(app).get('/api/billing/plans');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.plans).toBeDefined();
  });
});
