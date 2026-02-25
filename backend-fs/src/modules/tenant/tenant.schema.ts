import { Type } from 'typebox';

export const tenantBaseSchema = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255 }),
	address: Type.Optional(
		Type.Union([Type.String({ minLength: 1, maxLength: 255 }), Type.Null()])
	),
});

export const tenantCreateSchema = Type.Object({
	...tenantBaseSchema.properties,
});

export const tenantUpdateSchema = Type.Partial(tenantCreateSchema);

export const tenantResponseSchema = Type.Object({
	id: Type.Number(),
	...tenantBaseSchema.properties,
});

export const tenantParamsSchema = Type.Object({
	id: Type.Number(),
});

export type TenantCreateInput = Type.Static<typeof tenantCreateSchema>;
export type TenantUpdateInput = Type.Static<typeof tenantUpdateSchema>;
export type TenantResponse = Type.Static<typeof tenantResponseSchema>;
