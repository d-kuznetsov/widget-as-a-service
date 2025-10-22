import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength,
} from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(3)
	username: string;

	@IsString()
	@MinLength(2)
	firstName: string;

	@IsOptional()
	@IsString()
	lastName?: string;

	@IsEnum(Role)
	role: Role = Role.USER;
}
