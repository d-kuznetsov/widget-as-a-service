import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiPropertyOptional({
		description: 'Whether the user account is active',
		type: 'boolean',
		example: true,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
