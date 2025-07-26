import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ping } from './api/ping';
import { createUserApi, getAllUsersApi, loginUserApi, logoutUserApi, validateLoginApi } from "./api/users";
import { validateWithSchema } from "./api/validateschema"
import { requestLogger } from './api/logger';
import { authMiddleWare, errorMiddleWare } from './api/middleware';
import cookieParser from 'cookie-parser';
import {createProductReminderApi, getAllProductRemindersForUser} from "./api/productReminders";


dotenv.config();

const app = express();

export function configureApp(app: express.Express) {
	app.use(express.json());
	app.use(requestLogger);
	app.use(cookieParser());
	app.use(cors({ origin: "http://localhost:5173", credentials: true }));

	app.get('/', ping);

	const router = express.Router();

	router.post('/users', validateWithSchema("login.schema.json"), createUserApi);

	router.get('/users', getAllUsersApi);

	router.post('/login', loginUserApi)

	router.post('/logout', logoutUserApi)

	router.post('/product-reminders', authMiddleWare, validateWithSchema("product_reminder.schema.json"), createProductReminderApi);
	router.get('/me', authMiddleWare, validateLoginApi)

	router.post('/product-reminders', validateWithSchema("product_reminder.schema.json"), createProductReminderApi);

    router.get('/product-reminders', authMiddleWare, getAllProductRemindersForUser);

    app.use('/api/v1', router);
    app.use(errorMiddleWare);


	return app;
}

configureApp(app);
export default app;
