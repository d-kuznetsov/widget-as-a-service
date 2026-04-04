import { Type } from 'typebox';

export const serviceCreateSchema = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255 }),
	duration: Type.Integer({ minimum: 1 }),
	price: Type.String({ minLength: 1 }),
});

export const serviceUpdateSchema = Type.Partial(serviceCreateSchema);

export const serviceBaseParamsSchema = Type.Object({
	tenantId: Type.Number(),
});

export const serviceParamsSchema = Type.Object({
	...serviceBaseParamsSchema.properties,
	id: Type.Number(),
});

export const serviceResponseSchema = Type.Object({
	id: Type.Number(),
	tenantId: Type.Number(),
	name: Type.String(),
	duration: Type.Integer(),
	price: Type.String(),
});

export const assignSpecialistToServiceBodySchema = Type.Object({
	specialistId: Type.Number(),
});

export const unassignSpecialistFromServiceParamsSchema = Type.Object({
	...serviceParamsSchema.properties,
	specialistId: Type.Number(),
});

export const serviceSpecialistResponseSchema = Type.Object({
	id: Type.Number(),
	tenantId: Type.Number(),
	serviceId: Type.Number(),
	specialistId: Type.Number(),
	createdAt: Type.Any(),
	updatedAt: Type.Any(),
});

export type ServiceCreateInput = Type.Static<typeof serviceCreateSchema>;
export type ServiceUpdateInput = Type.Static<typeof serviceUpdateSchema>;
