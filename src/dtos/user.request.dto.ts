import { Static, TObject, Type } from '@sinclair/typebox';

import { customerValidator } from '../utils';

// Utility function to toggle optional fields
const defineSchema = (isOptional: boolean) => {
  const int = Type.Integer();
  const str = Type.String();
  const email = customerValidator(Type.String({ format: 'email' }), {});
  return {
    projectId: isOptional ? Type.Optional(int) : int,
    companyId: isOptional ? Type.Optional(int) : int,
    roleId: isOptional ? Type.Optional(int) : int,
    accessTypeId: isOptional ? Type.Optional(int) : int,
    genderId: isOptional ? Type.Optional(int) : int,
    username: isOptional ? Type.Optional(str) : str,
    email: isOptional ? Type.Optional(email) : email,
    password: isOptional ? Type.Optional(str) : str,
    contactNo: isOptional ? Type.Optional(str) : str,
    address: isOptional ? Type.Optional(str) : str,
    isActive: isOptional ? Type.Optional(int) : int,
    photoFile: isOptional ? Type.Optional(Type.Array(str)) : Type.Array(str),
  };
};

// Base Schemas
const BaseSchema = defineSchema(false);
const OptionalSchema = defineSchema(true);

// Create & Edit DTOs with overrides
export const Dto: Record<'create' | 'edit' | 'findAll', TObject> = {
  create: Type.Object({
    ...(({ isActive, photoFile, ...rest }) => rest)(BaseSchema), // Exclude photoFile & isActive
  }),
  edit: Type.Object({
    ...OptionalSchema,
  }),
  findAll: Type.Object({
    ...BaseSchema,
  }),
};

export type CreateType = Static<typeof Dto.create>;
export type EditType = Static<typeof Dto.edit>;
export type FindAllType = Static<typeof Dto.findAll>;
