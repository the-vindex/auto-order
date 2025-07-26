import express from 'express';
import dotenv from 'dotenv';
import { ping } from './api/ping';
import { createUserApi, getAllUsersApi, loginUserApi } from "./api/users";
import { validateWithSchema } from "./api/validateschema"

dotenv.config();

const app = express();

app.get('/', ping);

const router = express.Router();

router.post('/users', createUserApi);

router.get('/users', getAllUsersApi);

router.post('/login', loginUserApi)

app.use('/api/v1', router);

export default app;
