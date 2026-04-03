import { Type } from 'typebox';

export const specialistBaseSchema = Type.Object({
	userId: Type.Union([Type.Number(), Type.Null()]),
	name: Type.String({ minLength: 1, maxLength: 255 }),
	description: Type.Optional(Type.String()),
});

export const specialistCreateSchema = Type.Object({
	...specialistBaseSchema.properties,
});

export const specialistUpdateSchema = Type.Partial(specialistCreateSchema);

export const specialistBaseParamsSchema = Type.Object({
	tenantId: Type.Number(),
});

export const specialistParamsSchema = Type.Object({
	...specialistBaseParamsSchema.properties,
	id: Type.Number(),
});

export const specialistResponseSchema = Type.Object({
	id: Type.Number(),
	tenantId: Type.Number(),
	userId: Type.Union([Type.Number(), Type.Null()]),
	name: Type.String(),
	description: Type.String(),
});

export type SpecialistCreateInput = Type.Static<typeof specialistCreateSchema>;
export type SpecialistUpdateInput = Type.Static<typeof specialistUpdateSchema>;
