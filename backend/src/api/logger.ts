import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const start = Date.now();
	console.log(`--> ${req.method} ${req.originalUrl}`);

	// Clone the body to avoid modifying the original request object
	const bodyToLog = { ...req.body };

	// Sanitize sensitive fields
	if (bodyToLog.password) {
		bodyToLog.password = '[REDACTED]';
	}

	// Only log the body if it's not empty
	if (Object.keys(bodyToLog).length > 0) {
		console.log(bodyToLog);
	}

	res.on('finish', () => {
		const duration = Date.now() - start;
		console.log(`<-- ${req.method} ${req.originalUrl} [${res.statusCode}] (${duration}ms)`);
	});

	next();
}
