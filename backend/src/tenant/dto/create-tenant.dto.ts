import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
	@IsEmail()
	ownerEmail: string;
}
