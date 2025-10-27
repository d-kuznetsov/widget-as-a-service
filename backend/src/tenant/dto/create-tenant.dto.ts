import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTenantDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	address: string;

	@IsNotEmpty()
	@IsUUID()
	ownerId: string;
}
