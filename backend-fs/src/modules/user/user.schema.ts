import { Type } from 'typebox';

export const userCreateSchema = Type.Object({
	email: Type.String({ format: 'email', maxLength: 255 }),
	password: Type.String({ minLength: 8, maxLength: 255 }),
	firstName: Type.String({ minLength: 1, maxLength: 255 }),
	lastName: Type.String({ minLength: 1, maxLength: 255 }),
});

export const createUserResponseSchema = Type.Object({
	id: Type.Number(),
	email: Type.String({ format: 'email' }),
	firstName: Type.String(),
	lastName: Type.String(),
});

// export const createUserResponseSchema = Type.Intersect([
// 	Type.Object({
// 		id: Type.Number(),
// 	}),
// 	Type.Omit(userCreateSchema, ['password']),
// ]);

export type UserCreateDto = Type.Static<typeof userCreateSchema>;
