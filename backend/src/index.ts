import app from './server';
import dotenv from 'dotenv';
import './jobs/sendreminders'

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
