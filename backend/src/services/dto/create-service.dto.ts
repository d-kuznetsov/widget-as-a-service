import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
	IsUUID,
} from 'class-validator';

export class CreateServiceDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsNumber()
	@IsPositive({ message: 'Duration must be greater than 0' })
	duration: number; // Duration in minutes

	@IsNotEmpty()
	@IsNumber()
	@IsPositive({ message: 'Price must be greater than 0' })
	price: number;

	@IsNotEmpty()
	@IsUUID()
	tenantId: string;

	@IsNotEmpty()
	@IsArray()
	@IsUUID(undefined, { each: true })
	specialistIds: string[];
}
