"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpressAppWithFakeAuth = createExpressAppWithFakeAuth;
const express_1 = __importDefault(require("express"));
const fakeAuth_1 = require("../../src/auth/fakeAuth");
const server_1 = require("../../src/server");
function createExpressAppWithFakeAuth() {
    const app = (0, express_1.default)();
    app.use("/api/v1", fakeAuth_1.fakeAuth);
    (0, server_1.configureApp)(app);
    return app;
}
