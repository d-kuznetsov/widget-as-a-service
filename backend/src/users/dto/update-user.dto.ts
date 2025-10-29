import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ROLES, RoleName } from '../../roles/role.constants';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	@IsArray()
	@IsEnum(Object.values(ROLES), { each: true })
	roles?: RoleName[];
}
