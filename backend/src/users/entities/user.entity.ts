import type { Role } from "../enums/role.enum";

export class User {
	id: string;
	email: string;
	username: string;
	firstName?: string;
	lastName?: string;
	role: Role;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}
}
