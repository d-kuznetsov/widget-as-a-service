import type { Role } from "../enums/role.enum";

export class UserResponseDto {
	id: string;
	email: string;
	username: string;
	firstName?: string;
	lastName?: string;
	role: Role;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;

	constructor(user: Record<string, any>) {
		this.id = user.id;
		this.email = user.email;
		this.username = user.username;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.role = user.role;
		this.isActive = user.isActive;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
	}
}
