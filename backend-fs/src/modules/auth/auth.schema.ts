import { Type } from 'typebox';

export const loginSchema = Type.Object({
	email: Type.String({ format: 'email', maxLength: 255 }),
	password: Type.String({ minLength: 8, maxLength: 255 }),
});

export const registerSchema = Type.Object({
	token: Type.String({ minLength: 1, maxLength: 255 }),
	email: Type.String({ format: 'email', maxLength: 255 }),
	password: Type.String({ minLength: 8, maxLength: 255 }),
	firstName: Type.String({ minLength: 1, maxLength: 255 }),
	lastName: Type.String({ minLength: 1, maxLength: 255 }),
});

export const loginResponseSchema = Type.Object({
	accessToken: Type.String(),
	refreshToken: Type.String(),
});

export const refreshTokenSchema = Type.Object({
	refreshToken: Type.String(),
});

export const logoutSchema = Type.Object({
	refreshToken: Type.String(),
});

export type LoginInput = Type.Static<typeof loginSchema>;
export type RegisterInput = Type.Static<typeof registerSchema>;
export type LoginResponse = Type.Static<typeof loginResponseSchema>;
export type RefreshTokenInput = Type.Static<typeof refreshTokenSchema>;
