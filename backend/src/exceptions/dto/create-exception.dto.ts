import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsNotEmpty,
	IsString,
	IsUUID,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTimeBefore', async: false })
export class IsTimeBeforeConstraint implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints;
		const relatedValue = (args.object as Record<string, unknown>)[
			relatedPropertyName
		] as string;

		if (!value || !relatedValue) {
			return true; // Let other validators handle required validation
		}

		// Convert time strings to comparable format (HH:MM:SS)
		const time1 = this.parseTime(value);
		const time2 = this.parseTime(relatedValue);

		return time1 < time2;
	}

	private parseTime(timeStr: string): number {
		const [hours, minutes, seconds = '00'] = timeStr.split(':');
		return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
	}

	defaultMessage(args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints;
		return `${args.property} must be before ${relatedPropertyName}`;
	}
}

export class CreateExceptionDto {
	@ApiProperty({
		description: 'Date of the exception in ISO 8601 format (YYYY-MM-DD)',
		example: '2024-12-25',
		type: 'string',
		format: 'date',
	})
	@IsDateString()
	@IsNotEmpty()
	date: string;

	@ApiProperty({
		description:
			'Start time of the exception in HH:mm:ss format (24-hour). Must be before end time.',
		example: '10:00:00',
		pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
	})
	@IsString()
	@IsNotEmpty()
	//@Validate(IsTimeBeforeConstraint, ['endTime'])
	startTime: string;

	@ApiProperty({
		description: 'End time of the exception in HH:mm:ss format (24-hour)',
		example: '14:00:00',
		pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
	})
	@IsString()
	@IsNotEmpty()
	endTime: string;

	@ApiProperty({
		description: 'Reason for the exception',
		example: 'Holiday - Office closed',
	})
	@IsString()
	@IsNotEmpty()
	reason: string;

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
	@IsUUID()
	@IsNotEmpty()
	tenantId: string;
}
