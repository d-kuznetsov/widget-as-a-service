import { Type } from 'typebox';

export const userBaseSchema = Type.Object(
	{
		email: Type.String({ format: 'email', maxLength: 255 }),
		firstName: Type.String({ minLength: 1, maxLength: 255 }),
		lastName: Type.String({ minLength: 1, maxLength: 255 }),
	},
	{ $id: 'userBase' }
);

export const userCreateSchema = Type.Object(
	{
		...userBaseSchema.properties,
		password: Type.String({ minLength: 8, maxLength: 255 }),
	},
	{ $id: 'userCreate' }
);

export const createUserResponseSchema = Type.Object(
	{
		id: Type.Number(),
		...userBaseSchema.properties,
	},
	{ $id: 'userCreateResponse' }
);

export const userFindOneParamsSchema = Type.Object({
	id: Type.Number(),
});

export const userFindOneResponseSchema = Type.Object({
	...createUserResponseSchema.properties,
});

export type UserCreateDto = Type.Static<typeof userCreateSchema>;
