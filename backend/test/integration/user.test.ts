import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../src/server';
import { db } from '../../src/db';
import { users } from '../../src/db/schema';

describe('User API Integration Tests', () => {
  beforeAll(async () => {
    // You might want to clear the database or seed it before running tests
    // For now, we'll just ensure the app is ready.
  });

  afterAll(async () => {
    // Clean up any test data if necessary
    await db.delete(users);
  });

  it('should create a new user via POST /api/v1/users', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Integration Test User' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty('userId');
    expect(res.body.name).toEqual('Integration Test User');
  });

  it('should get all users via GET /api/v1/users', async () => {
    // First, create a user to ensure there's data to retrieve
    await request(app)
      .post('/api/v1/users')
      .send({ fullName: 'Another Test User' });

    const res = await request(app).get('/api/v1/users');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('userId');
    expect(res.body[0]).toHaveProperty('name');
  });
});
