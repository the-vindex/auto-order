import { Validator } from 'jsonschema';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const v = new Validator();

export function validateWithSchema(schemaName: string) {
	const schemaPath = path.join(__dirname, '..', 'api', 'contracts', schemaName);
	const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

	return (req: Request, res: Response, next: NextFunction) => {
		const result = v.validate(req.body, schema);
		if (!result.valid) {
			return res.status(400).json({
				errors: result.errors.map(e => e.stack),
			});
		}
		next();
	};
}
