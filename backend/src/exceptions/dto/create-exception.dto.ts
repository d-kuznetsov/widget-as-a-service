import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateExceptionDto {
	@IsDateString()
	@IsNotEmpty()
	date: string;

	@IsString()
	@IsNotEmpty()
	startTime: string;

	@IsString()
	@IsNotEmpty()
	endTime: string;

	@IsString()
	@IsNotEmpty()
	reason: string;

	@IsString()
	@IsNotEmpty()
	specialistId: string;
}
