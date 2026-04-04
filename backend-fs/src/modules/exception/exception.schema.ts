import { Type } from 'typebox';

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

export type ExceptionCreateInput = Type.Static<typeof exceptionCreateSchema>;
export type ExceptionUpdateInput = Type.Static<typeof exceptionUpdateSchema>;
