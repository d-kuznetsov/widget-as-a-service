import { Type } from 'typebox';

export const exceptionBaseParamsSchema = Type.Object({
	tenantId: Type.Number(),
});

export const exceptionParamsSchema = Type.Object({
	...exceptionBaseParamsSchema.properties,
	id: Type.Number(),
});

export const exceptionCreateSchema = Type.Object({
	specialistId: Type.Number(),
	date: Type.String({ minLength: 1 }),
	startTime: Type.String({ minLength: 1 }),
	endTime: Type.String({ minLength: 1 }),
	reason: Type.String({ minLength: 1 }),
});

export const exceptionUpdateSchema = Type.Partial(
	Type.Object({
		date: Type.String({ minLength: 1 }),
		startTime: Type.String({ minLength: 1 }),
		endTime: Type.String({ minLength: 1 }),
		reason: Type.String({ minLength: 1 }),
	})
);

export const exceptionResponseSchema = Type.Object({
	id: Type.Number(),
	tenantId: Type.Number(),
	specialistId: Type.Number(),
	date: Type.String(),
	startTime: Type.String(),
	endTime: Type.String(),
	reason: Type.String(),
	createdAt: Type.Any(),
	updatedAt: Type.Any(),
});

export type ExceptionCreateInput = Type.Static<typeof exceptionCreateSchema>;
export type ExceptionUpdateInput = Type.Static<typeof exceptionUpdateSchema>;
