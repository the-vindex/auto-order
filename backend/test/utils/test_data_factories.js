"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestUserObject = generateTestUserObject;
/**
 * Crate new user with random email for testing purposes.
 * @returns {Object} user object with name, email, and password.
 */
function generateTestUserObject() {
    const user = {
        name: 'Test User',
        email: `test${Math.floor(Math.random() * 10000)}@jest.com`,
        password: 'password'
    };
    return user;
}
