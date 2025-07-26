import express from 'express';
import dotenv from 'dotenv';
import {ping} from './api/ping';
import {createUserApi, getAllUsersApi} from "./api/users";
import {validateWithSchema} from "./api/validateschema"

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', ping);

const userRouter = express.Router();


userRouter.post('/users', validateWithSchema("login.schema.json"), createUserApi);


userRouter.get('/users', getAllUsersApi);

app.use('/api/v1', userRouter);

export default app;
