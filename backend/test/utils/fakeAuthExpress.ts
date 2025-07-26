import express from "express";
import {fakeAuth} from "../../src/auth/fakeAuth";
import {configureApp} from "../../src/server";

export function createExpressAppWithFakeAuth() {
    const app = express();
    app.use("/api/v1", fakeAuth);
    configureApp(app);
    return app;
}
