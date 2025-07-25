import express from 'express';
import dotenv from 'dotenv';
import {db} from './db';
import {users} from './db/schema';
import {getAllUsers} from "./db/queries/user_queries";
import {ping} from './api/ping';
import {createUserApi, getAllUsersApi} from "./api/users";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', ping);

app.post('/user', createUserApi);

app.get('/users', getAllUsersApi);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
