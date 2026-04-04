import { Type } from 'typebox';

const weekdaySchema = Type.Union([
	Type.Literal('monday'),
	Type.Literal('tuesday'),
	Type.Literal('wednesday'),
	Type.Literal('thursday'),
	Type.Literal('friday'),
	Type.Literal('saturday'),
	Type.Literal('sunday'),
]);

export const workingHoursBaseParamsSchema = Type.Object({
	tenantId: Type.Number(),
});

export const workingHoursParamsSchema = Type.Object({
	...workingHoursBaseParamsSchema.properties,
	id: Type.Number(),
});

export const workingHoursCreateSchema = Type.Object({
	specialistId: Type.Number(),
	dayOfWeek: weekdaySchema,
	startTime: Type.String({ minLength: 1 }),
	endTime: Type.String({ minLength: 1 }),
	isActive: Type.Optional(Type.Boolean()),
});

export const workingHoursUpdateSchema = Type.Partial(
	Type.Object({
		dayOfWeek: weekdaySchema,
		startTime: Type.String({ minLength: 1 }),
		endTime: Type.String({ minLength: 1 }),
		isActive: Type.Boolean(),
	})
);

export const workingHoursResponseSchema = Type.Object({
	id: Type.Number(),
	tenantId: Type.Number(),
	specialistId: Type.Number(),
	dayOfWeek: weekdaySchema,
	startTime: Type.String(),
	endTime: Type.String(),
	isActive: Type.Boolean(),
	createdAt: Type.Any(),
	updatedAt: Type.Any(),
});

export type WorkingHoursCreateInput = Type.Static<
	typeof workingHoursCreateSchema
>;
export type WorkingHoursUpdateInput = Type.Static<
	typeof workingHoursUpdateSchema
>;
