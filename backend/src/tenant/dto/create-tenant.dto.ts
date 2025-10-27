import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTenantDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	address: string;

	@IsOptional()
	@IsString()
	timezone?: string;

	@IsNotEmpty()
	@IsUUID()
	ownerId: string;
}
