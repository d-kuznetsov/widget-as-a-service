import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSpecialistDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsOptional()
	@IsUUID()
	userId?: string;

	@IsNotEmpty()
	@IsUUID()
	tenantId: string;
}
