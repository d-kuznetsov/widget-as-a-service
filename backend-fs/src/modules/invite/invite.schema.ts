import { Type } from 'typebox';

export const inviteBaseSchema = Type.Object({
	email: Type.String({ format: 'email', maxLength: 255 }),
	tenantId: Type.Number(),
	roleId: Type.Number(),
});

export const inviteCreateSchema = Type.Object({
	...inviteBaseSchema.properties,
});

export const inviteResponseSchema = Type.Object({
	id: Type.Number(),
	token: Type.String(),
});

export const inviteParamsSchema = Type.Object({
	id: Type.Number(),
});

export const inviteUpdateSchema = Type.Partial(inviteBaseSchema);

export type InviteCreateInput = Type.Static<typeof inviteCreateSchema>;
export type InviteUpdateInput = Type.Static<typeof inviteUpdateSchema>;
