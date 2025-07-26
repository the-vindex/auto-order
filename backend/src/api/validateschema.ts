import { Validator } from 'jsonschema';
import { Request, Response, NextFunction } from 'express';

const v = new Validator();

// A cache for the schemas
const schemaCache: { [key: string]: object } = {};

export function validateWithSchema(schemaName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!schemaCache[schemaName]) {
        // Dynamically import the schema. The path is relative to the current file.
        const schema = await import(`./contracts/${schemaName}`);
        schemaCache[schemaName] = schema.default;
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
