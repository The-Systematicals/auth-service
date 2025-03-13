import { Static, Type } from '@sinclair/typebox';

import { customerValidator } from '../../../user-service/src/utils/validators';

export const basic = Type.Object({
  name: customerValidator(Type.String({ maxLength: 255 }), {
    maxLength: 'Name cannot exceed 255 characters.',
  }),
});

export type BasicRequestType = Static<typeof basic>;
