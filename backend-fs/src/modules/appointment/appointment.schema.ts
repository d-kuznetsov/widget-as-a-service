import { Type } from 'typebox';

export const appointmentStatusSchema = Type.Union([
	Type.Literal('pending'),
	Type.Literal('confirmed'),
	Type.Literal('completed'),
	Type.Literal('canceled'),
]);

export const appointmentBaseParamsSchema = Type.Object({
	tenantId: Type.Number(),
});

export const appointmentParamsSchema = Type.Object({
	...appointmentBaseParamsSchema.properties,
	id: Type.Number(),
});

export const appointmentCreateSchema = Type.Object({
	specialistId: Type.Number(),
	serviceId: Type.Number(),
	customerName: Type.String({ minLength: 1 }),
	customerEmail: Type.String({ minLength: 1 }),
	customerPhone: Type.Optional(Type.String()),
	date: Type.String({ minLength: 1 }),
	startTime: Type.String({ minLength: 1 }),
	endTime: Type.String({ minLength: 1 }),
});

export const appointmentUpdateSchema = Type.Partial(
	Type.Object({
		specialistId: Type.Number(),
		serviceId: Type.Number(),
		customerName: Type.String({ minLength: 1 }),
		customerEmail: Type.String({ minLength: 1 }),
		customerPhone: Type.String(),
		date: Type.String({ minLength: 1 }),
		startTime: Type.String({ minLength: 1 }),
		endTime: Type.String({ minLength: 1 }),
		status: appointmentStatusSchema,
	})
);

export const appointmentResponseSchema = Type.Object({
	id: Type.Number(),
	tenantId: Type.Number(),
	specialistId: Type.Number(),
	serviceId: Type.Number(),
	customerName: Type.String(),
	customerEmail: Type.String(),
	customerPhone: Type.Union([Type.String(), Type.Null()]),
	date: Type.String(),
	startTime: Type.String(),
	endTime: Type.String(),
	status: appointmentStatusSchema,
	createdAt: Type.Any(),
	updatedAt: Type.Any(),
});

export type AppointmentCreateInput = Type.Static<
	typeof appointmentCreateSchema
>;
export type AppointmentUpdateInput = Type.Static<
	typeof appointmentUpdateSchema
>;
