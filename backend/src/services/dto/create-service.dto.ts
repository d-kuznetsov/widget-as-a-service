import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsString,
	IsUUID,
	Min,
} from 'class-validator';

export class CreateServiceDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	duration: number; // Duration in minutes

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	price: number;

	@IsNotEmpty()
	@IsArray()
	@IsUUID('4', { each: true })
	specialistIds: string[];
}
