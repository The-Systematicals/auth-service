import { Static, Type } from '@sinclair/typebox';

export const Dto = {
  login: Type.Object({
    password: Type.String({ minLength: 1 }),
    email: Type.Optional(Type.String({ minLength: 1 })),
    username: Type.Optional(Type.String({ minLength: 1 })),
  }),
};

export type LoginType = Static<typeof Dto.login>;
