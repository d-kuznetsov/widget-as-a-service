import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsBoolean,
	IsEnum,
	IsMilitaryTime,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { DayOfWeek } from '../entities/working-hours.entity';

@ValidatorConstraint({ name: 'isTimeBefore', async: false })
export class IsTimeBeforeConstraint implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints;
		const relatedValue = (args.object as Record<string, unknown>)[
			relatedPropertyName
		];
		if (!value || !relatedValue) return true;

		const start = new Date(`1970-01-01T${value}`);
		const end = new Date(`1970-01-01T${relatedValue}`);
		return start < end;
	}

	defaultMessage(args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints;
		return `${args.property} must be before ${relatedPropertyName}`;
	}
}

export class CreateWorkingHoursDto {
	@ApiProperty({
		description: 'Day of the week for working hours',
		enum: DayOfWeek,
		example: DayOfWeek.MONDAY,
	})
	@IsEnum(DayOfWeek)
	@IsNotEmpty()
	dayOfWeek: DayOfWeek;

	@ApiProperty({
		description: 'Start time of working hours in HH:mm:ss format (24-hour)',
		example: '09:00:00',
		pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
	})
	@IsNotEmpty()
	@IsMilitaryTime()
	startTime: string;

	@ApiProperty({
		description:
			'End time of working hours in HH:mm:ss format (24-hour). Must be after start time.',
		example: '17:00:00',
		pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
	})

	@IsNotEmpty()
	endTime: string;

	@ApiPropertyOptional({
		description: 'Whether the working hours are currently active',
		default: true,
		example: true,
	})
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@ApiProperty({
		description: 'UUID of the specialist',
		example: '123e4567-e89b-12d3-a456-426614174000',
		format: 'uuid',
	})
	@IsString()
	@IsNotEmpty()
	specialistId: string;

	@ApiProperty({
		description: 'UUID of the tenant',
		example: '123e4567-e89b-12d3-a456-426614174001',
		format: 'uuid',
	})
	@IsString()
	@IsNotEmpty()
	tenantId: string;
}
