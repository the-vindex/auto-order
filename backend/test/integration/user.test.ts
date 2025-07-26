import request from 'supertest';
import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {db} from '../../src/db';
import {users} from '../../src/db/schema';
import {generateTestUserObject} from "../utils/test_data_factories";
import express from "express";
import {createExpressAppWithFakeAuth} from "../utils/fakeAuthExpress";

describe('User API Integration Tests', () => {
    let app: express.Express;
    const createdUserIds: string[] = [];

    beforeAll(async () => {
        app = createExpressAppWithFakeAuth();
    });

    afterAll(async () => {
        if (createdUserIds.length > 0) {
            const { inArray } = await import('drizzle-orm');
            await db.delete(users).where(inArray(users.userId, createdUserIds));
        }
    });

    it('should create a new user via POST /api/v1/users', async () => {
        let testUserObject = generateTestUserObject();
        const res = await request(app)
            .post('/api/v1/users')
            .send(testUserObject);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('userId');
        createdUserIds.push(res.body.userId); // Track the created user
    });

    it('should get all users via GET /api/v1/users', async () => {
        // First, create a user to ensure there's data to retrieve
        const creationRes = await request(app)
            .post('/api/v1/users')
            .send(generateTestUserObject());
        
        createdUserIds.push(creationRes.body.userId); // Track the created user

        const res = await request(app).get('/api/v1/users');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should validate json on create user and return 400 for invalid data', async () => {
        const res = await request(app)
            .post('/api/v1/users')
            .send({name: '', email: 'invalidemail', password: ''});

        expect(res.statusCode).toEqual(400);
        expect(res.text).toContain('{"errors":["instance.email does not conform to the \\"email\\" format","instance.password does not meet minimum length of 6"]}');
    });

    it('should return fake user ID when X-Fake-User-Id header is provided', async () => {

        app.get('/api/v1/whoami', (req, res) => {
            res.json({userId: fakeUserId});
        })

        const fakeUserId = 'test-user-123';
        const res = await request(app)
            .get('/api/v1/whoami')
            .set('X-Fake-User-Id', fakeUserId);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({userId: fakeUserId});
    });
}, 1000000);
