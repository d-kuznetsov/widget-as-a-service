import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
	@IsNotEmpty()
	@IsUUID()
	user: string;

	@IsNotEmpty()
	@IsUUID()
	specialist: string;

	@IsNotEmpty()
	@IsUUID()
	service: string;

	@IsNotEmpty()
	startTime: Date;

	@IsNotEmpty()
	endTime: Date;

	@IsOptional()
	@IsEnum(AppointmentStatus)
	status?: AppointmentStatus;

	@IsOptional()
	@IsString()
	comment?: string;
}
