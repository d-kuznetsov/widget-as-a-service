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
	@IsDateString()
	@IsNotEmpty()
	date: string;

	@IsString()
	@IsNotEmpty()
	@Validate(IsTimeBeforeConstraint, ['endTime'])
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

	@IsUUID()
	@IsNotEmpty()
	tenantId: string;
}
