import { Type } from 'typebox';

export const signInSchema = Type.Object({
	email: Type.String({ format: 'email', maxLength: 255 }),
	password: Type.String({ minLength: 8, maxLength: 255 }),
});

export const signInResponseSchema = Type.Object({
	accessToken: Type.String(),
	refreshToken: Type.String(),
});

export const refreshTokenSchema = Type.Object({
	refreshToken: Type.String(),
});

export const signOutSchema = Type.Object({});

export type SignInInput = Type.Static<typeof signInSchema>;
export type SignInResponse = Type.Static<typeof signInResponseSchema>;
export type RefreshTokenInput = Type.Static<typeof refreshTokenSchema>;
