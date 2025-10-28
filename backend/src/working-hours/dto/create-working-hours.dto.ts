import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
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
	@IsEnum(DayOfWeek)
	@IsNotEmpty()
	dayOfWeek: DayOfWeek;

	@IsString()
	@IsNotEmpty()
	@Validate(IsTimeBeforeConstraint, ['endTime'])
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

	@IsString()
	@IsNotEmpty()
	tenantId: string;
}
