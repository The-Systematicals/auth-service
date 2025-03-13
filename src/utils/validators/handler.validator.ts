import { Static, TSchema } from '@sinclair/typebox';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ErrorValidation } from '../errors';

const ajv = new Ajv({ allErrors: true, coerceTypes: true, verbose: true });
ajv.addKeyword('errorMessages');
addFormats(ajv);

export const handleRequest = <T extends TSchema>(requestBody: unknown, schema: T) => {
  const validate = ajv.compile<Static<T>>(schema);

  if (validate(requestBody)) return null;

  // Ensure schema is a TypeBox schema
  const typeboxSchema = schema as { properties?: Record<string, any> };

  // Use a map to group errors by field
  const errorMap: Record<string, { messages: string[]; expected: Record<string, any> }> = {};

  (validate.errors || []).forEach((err) => {
    const field = err.instancePath.replace('/', '');
    const keyword = err.keyword;
    let message = err.message || 'Invalid input';

    // Check for custom error messages in the schema
    if (typeboxSchema.properties?.[field]?.errorMessages?.[keyword]) {
      message = typeboxSchema.properties[field].errorMessages[keyword];
    }

    // Initialize the field in the error map if not exists
    if (!errorMap[field]) {
      errorMap[field] = { messages: [], expected: {} };
    }

    // Avoid duplicate messages
    if (!errorMap[field].messages.includes(message)) {
      errorMap[field].messages.push(message);
    }

    // Merge expected values
    errorMap[field].expected[keyword] = err.params[keyword] || err.params;
  });

  // Convert grouped errors to array format
  const groupedErrors = Object.entries(errorMap).map(([field, data]) => ({
    field,
    message: data.messages,
    expected: data.expected,
  }));

  throw new ErrorValidation('Error on validation', groupedErrors);
};
