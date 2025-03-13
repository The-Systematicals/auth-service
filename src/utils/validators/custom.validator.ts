import { TSchema } from '@sinclair/typebox';

export const customerValidator = <T extends TSchema>(schema: T, messages: Record<string, string>) => {
  return { ...schema, errorMessages: messages };
};
