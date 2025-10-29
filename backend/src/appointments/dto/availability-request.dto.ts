import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsUUID,
	Max,
	Min,
} from 'class-validator';

export class AvailabilityRequestDto {
	@IsNotEmpty()
	@IsUUID()
	specialistId: string;

	@IsNotEmpty()
	@IsUUID()
	serviceId: string;

	@IsNotEmpty()
	@IsDateString()
	date: string;

	@IsOptional()
	@IsPositive()
	@Min(5)
	@Max(120)
	slotIntervalMinutes?: number = 15;
}
