import express from "express";
import {fakeAuth} from "../../src/auth/fakeAuth";
import {configureApp} from "../../src/server";
import {generateTestUserObject} from "./test_data_factories";
import {createUser} from "../../src/db/queries/user_queries";
import request from "supertest";
import {expect} from "vitest";

export function createExpressAppWithFakeAuth() {
    const app = express();
    app.use("/api/v1", fakeAuth);
    configureApp(app);
    return app;
}

export async function createAndLoginUser(app: express.Express) {
    const newUserData = generateTestUserObject();

//    let newUser = await createUser(newUserData.name, newUserData.email, newUserData.password);

    const res = await request(app)
        .post('/api/v1/users')
        .send(newUserData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toBeDefined();
    const newUser = res.body;

    if (!newUser) {
        throw new Error("Failed to create test user");
    }

    const loginResult = await request(app)
        .post('/api/v1/login')
        .send({email: newUserData.email, password: newUserData.password})
        .set('Accept', 'application/json')
        .expect(200);

    //extract login cookie - jwt token
    const authCookie = loginResult.headers['set-cookie']?.[0];
    expect(authCookie).toBeDefined();
    return {newUser, authCookie};
}