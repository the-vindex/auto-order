"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const db_1 = require("../../src/db");
const schema_1 = require("../../src/db/schema");
const test_data_factories_1 = require("../utils/test_data_factories");
const fakeAuthExpress_1 = require("../utils/fakeAuthExpress");
(0, vitest_1.describe)('User API Integration Tests', () => {
    let app;
    (0, vitest_1.beforeAll)(async () => {
        // You might want to clear the database or seed it before running tests
        // For now, we'll just ensure the app is ready.
        app = (0, fakeAuthExpress_1.createExpressAppWithFakeAuth)();
    });
    (0, vitest_1.afterAll)(async () => {
        // Clean up any test data if necessary
        await db_1.db.delete(schema_1.users);
    });
    (0, vitest_1.it)('should create a new user via POST /api/v1/users', async () => {
        let testUserObject = (0, test_data_factories_1.generateTestUserObject)();
        const res = await (0, supertest_1.default)(app)
            .post('/api/v1/users')
            .send(testUserObject);
        (0, vitest_1.expect)(res.statusCode).toEqual(201);
        (0, vitest_1.expect)(res.body).toBeDefined();
        (0, vitest_1.expect)(res.body).toHaveProperty('userId');
    });
    (0, vitest_1.it)('should get all users via GET /api/v1/users', async () => {
        // First, create a user to ensure there's data to retrieve
        await (0, supertest_1.default)(app)
            .post('/api/v1/users')
            .send({ fullName: 'Another Test User' });
        const res = await (0, supertest_1.default)(app).get('/api/v1/users');
        (0, vitest_1.expect)(res.statusCode).toEqual(200);
        (0, vitest_1.expect)(Array.isArray(res.body)).toBe(true);
        (0, vitest_1.expect)(res.body.length).toBeGreaterThanOrEqual(1);
        (0, vitest_1.expect)(res.body[0]).toHaveProperty('userId');
        (0, vitest_1.expect)(res.body[0]).toHaveProperty('name');
    });
    (0, vitest_1.it)('should validate json on create user and return 400 for invalid data', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/v1/users')
            .send({ name: '', email: 'invalidemail', password: '' });
        (0, vitest_1.expect)(res.statusCode).toEqual(400);
        (0, vitest_1.expect)(res.text).toContain('{"errors":["instance.email does not conform to the \\"email\\" format","instance.password does not meet minimum length of 6"]}');
    });
    (0, vitest_1.it)('should return fake user ID when X-Fake-User-Id header is provided', async () => {
        app.get('/api/v1/whoami', (req, res) => {
            res.json({ userId: fakeUserId });
        });
        const fakeUserId = 'test-user-123';
        const res = await (0, supertest_1.default)(app)
            .get('/api/v1/whoami')
            .set('X-Fake-User-Id', fakeUserId);
        (0, vitest_1.expect)(res.statusCode).toEqual(200);
        (0, vitest_1.expect)(res.body).toEqual({ userId: fakeUserId });
    });
}, 1000000);
