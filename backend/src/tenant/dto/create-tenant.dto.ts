import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTenantDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@IsString()
	timezone?: string;

	@IsNotEmpty()
	@IsUUID()
	ownerId: string;
}
