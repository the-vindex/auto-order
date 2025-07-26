import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const start = Date.now();
	console.log(`--> ${req.method} ${req.originalUrl}`);
	console.log(req.body)

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`<-- ${req.method} ${req.originalUrl} [${res.statusCode}] (${duration}ms)`);
	});

	next();
}
