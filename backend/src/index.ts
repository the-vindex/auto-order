import express from 'express';
import dotenv from 'dotenv';
import {ping} from './api/ping';
import {createUserApi, getAllUsersApi} from "./api/users";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', ping);

const userRouter = express.Router();

userRouter.post('/users', createUserApi);

userRouter.get('/users', getAllUsersApi);

app.use('/api/v1', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
