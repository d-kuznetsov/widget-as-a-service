import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	MinLength,
} from 'class-validator';
import { ROLES, type RoleName } from '../../roles/role.constants';

export class CreateUserWithRoleDto {
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

	@IsNotEmpty()
	@IsEnum(Object.values(ROLES))
	roleName: RoleName;
}
