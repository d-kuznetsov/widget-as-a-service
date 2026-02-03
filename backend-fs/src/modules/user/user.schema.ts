import { Type } from 'typebox';

export const createUserSchema = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String(),
	firstName: Type.String(),
	lastName: Type.String(),
});

export type CreateUserDto = Type.Static<typeof createUserSchema>;
