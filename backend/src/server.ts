import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ping } from './api/ping';
import { createUserApi, getAllUsersApi, loginUserApi, validateLoginApi } from "./api/users";
import { validateWithSchema } from "./api/validateschema"
import { requestLogger } from './api/logger';
import { authMiddleWare, errorMiddleWare } from './api/middleware';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get('/', ping);

const router = express.Router();

router.post('/users', validateWithSchema("login.schema.json"), createUserApi);

router.get('/users', getAllUsersApi);

router.post('/login', loginUserApi)

router.get('/me', authMiddleWare, validateLoginApi)

app.use('/api/v1', router);
app.use(errorMiddleWare);

export default app;
