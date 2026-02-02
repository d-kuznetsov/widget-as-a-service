import { Type } from 'typebox';

export const userSchema = Type.Object({
	name: Type.String(),
});

export type UserDto = Type.Static<typeof userSchema>;
