import { Type } from 'typebox';

export const inviteCreateSchema = Type.Object({
	email: Type.String({ format: 'email', maxLength: 255 }),
	roleId: Type.Number(),
	specialistId: Type.Optional(Type.Number()),
});

export const inviteResponseSchema = Type.Object({
	id: Type.Number(),
	token: Type.String(),
});

export const inviteCreateParamsSchema = Type.Object({
	tenantId: Type.Number(),
});

export const inviteDeleteParamsSchema = Type.Object({
	tenantId: Type.Number(),
	id: Type.Number(),
});

export type InviteCreateInput = Type.Static<typeof inviteCreateSchema>;
