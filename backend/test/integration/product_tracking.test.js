"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const user_queries_1 = require("../../src/db/queries/user_queries");
const test_data_factories_1 = require("../utils/test_data_factories");
const fakeAuthExpress_1 = require("../utils/fakeAuthExpress");
(0, vitest_1.describe)('Product tracking API Integration Tests', () => {
    let app;
    (0, vitest_1.beforeAll)(async () => {
        // You might want to clear the database or seed it before running tests
        // For now, we'll just ensure the app is ready.
        app = (0, fakeAuthExpress_1.createExpressAppWithFakeAuth)();
    });
    (0, vitest_1.afterAll)(async () => {
    });
    (0, vitest_1.it)('should create a new product tracking record via POST /api/v1/product-tracking', async () => {
        const newUserData = (0, test_data_factories_1.generateTestUserObject)();
        let newUser = await (0, user_queries_1.createUser)(newUserData.name, newUserData.email, newUserData.password);
        const productReminderData = {
            name: "Test Product",
            urls: ["https://example.com/product1"],
            reminderDetails: {
                type: "targetDate",
                targetDate: "2023-01-01",
            }
        };
        let result = await (0, supertest_1.default)(app)
            .post('/api/v1/product-reminders')
            .send(productReminderData)
            .set('X-Fake-User-Id', newUser.userId)
            .set('Accept', 'application/json')
            //            .expect('Content-Type', /json/)
            .expect(201);
        (0, vitest_1.expect)(result).toBeDefined();
        let resultBody = result.body;
        (0, vitest_1.expect)(result.statusCode, JSON.stringify(resultBody)).toEqual(201);
        (0, vitest_1.expect)(resultBody).toBeDefined();
        (0, vitest_1.expect)(resultBody).toHaveProperty('productId');
        (0, vitest_1.expect)(resultBody).toHaveProperty('name', productReminderData.name);
        (0, vitest_1.expect)(resultBody).toHaveProperty('urls', productReminderData.urls);
        (0, vitest_1.expect)(resultBody).toHaveProperty('status', 'active');
        (0, vitest_1.expect)(resultBody).toHaveProperty('reminderDetails');
        const reminderDetails = productReminderData.reminderDetails;
        if (reminderDetails.type === 'targetDate') {
            (0, vitest_1.expect)(resultBody.reminderDetails).toHaveProperty('type', reminderDetails.type);
            (0, vitest_1.expect)(resultBody.reminderDetails).toHaveProperty('targetDate', reminderDetails.targetDate);
        }
        else {
            throw new Error(`This shouldn't happen, Unsupported reminder type: ${reminderDetails.type}`);
        }
    });
});
