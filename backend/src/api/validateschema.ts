import { Validator } from 'jsonschema';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const v = new Validator();
const schemaCache: { [key: string]: object } = {};

export function validateWithSchema(schemaName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!schemaCache[schemaName]) {
        // __dirname is safe and available in the CommonJS environment that ts-node uses
        const schemaPath = path.join(__dirname, 'contracts', schemaName);
        const schemaData = fs.readFileSync(schemaPath, 'utf8');
        schemaCache[schemaName] = JSON.parse(schemaData);
      }

      const schema = schemaCache[schemaName];
      const result = v.validate(req.body, schema);

      if (!result.valid) {
        return res.status(400).json({
          errors: result.errors.map(e => e.stack),
        });
      }
      next();
    } catch (error) {
      console.error(`Failed to load or validate schema ${schemaName}:`, error);
      return res.status(500).send('Internal server error');
    }
  };
}
