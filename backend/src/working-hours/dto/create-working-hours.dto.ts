import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { DayOfWeek } from '../entities/working-hours.entity';

export class CreateWorkingHoursDto {
	@IsEnum(DayOfWeek)
	@IsNotEmpty()
	dayOfWeek: DayOfWeek;

	@IsString()
	@IsNotEmpty()
	startTime: string;

	@IsString()
	@IsNotEmpty()
	endTime: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsString()
	@IsNotEmpty()
	specialistId: string;
}
