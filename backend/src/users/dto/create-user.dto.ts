import {
	ArrayNotEmpty,
	IsArray,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	MinLength,
} from 'class-validator';
import { ROLES, type RoleName } from '../../roles/role.constants';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	password: string;

	@IsArray()
	@ArrayNotEmpty()
	@IsEnum(Object.values(ROLES), { each: true })
	roles: RoleName[];
}
