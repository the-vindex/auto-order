import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ping } from './api/ping';
import { createUserApi, getAllUsersApi, loginUserApi } from "./api/users";
import { validateWithSchema } from "./api/validateschema"


dotenv.config();

const app = express();

app.get('/', ping);

app.use(express.json())
app.use(cors())

const router = express.Router();

router.post('/users', validateWithSchema("login.schema.json"), createUserApi);

router.get('/users', getAllUsersApi);

router.post('/login', loginUserApi)

app.use('/api/v1', router);

export default app;
