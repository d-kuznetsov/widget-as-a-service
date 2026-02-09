import { Type } from 'typebox';
import { Roles } from '../../shared/utils/roles';

export const userBaseSchema = Type.Object({
	email: Type.String({ format: 'email', maxLength: 255 }),
	firstName: Type.String({ minLength: 1, maxLength: 255 }),
	lastName: Type.String({ minLength: 1, maxLength: 255 }),
});

export const userCreateSchema = Type.Object({
	password: Type.String({ minLength: 8, maxLength: 255 }),
	...userBaseSchema.properties,
});

export const userUpdateSchema = Type.Partial(userCreateSchema);

export const userResponseSchema = Type.Object({
	id: Type.Number(),
	...userBaseSchema.properties,
});

export const userParamsSchema = Type.Object({
	id: Type.Number(),
});

export const userUpdateRolesSchema = Type.Object({
	roles: Type.Array(Type.String({ enum: Object.values(Roles) })),
});

export type UserCreateInput = Type.Static<typeof userCreateSchema>;
export type UserUpdateInput = Type.Static<typeof userUpdateSchema>;
export type UserResponse = Type.Static<typeof userResponseSchema>;
