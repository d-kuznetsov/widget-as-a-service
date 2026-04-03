import { Type } from 'typebox';

export const serviceCreateSchema = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255 }),
	duration: Type.Integer({ minimum: 1 }),
	price: Type.String({ minLength: 1 }),
});

export const serviceUpdateSchema = Type.Partial(serviceCreateSchema);

export type ServiceCreateInput = Type.Static<typeof serviceCreateSchema>;
export type ServiceUpdateInput = Type.Static<typeof serviceUpdateSchema>;
