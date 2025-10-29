import { ApiProperty } from '@nestjs/swagger';
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
	@ApiProperty({
		description: 'Username for the user',
		minLength: 3,
		example: 'john_doe',
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	username: string;

	@ApiProperty({
		description: 'Email address of the user',
		format: 'email',
		example: 'john.doe@example.com',
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'Password for the user account',
		minLength: 6,
		example: 'securePassword123',
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	password: string;

	@ApiProperty({
		description: 'Array of roles assigned to the user',
		enum: Object.values(ROLES),
		isArray: true,
		example: ['client', 'specialist'],
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsEnum(Object.values(ROLES), {
		each: true,
		message: 'Invalid role provided',
	})
	roles: RoleName[];
}
