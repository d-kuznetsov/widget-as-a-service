import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentSlotDto } from './dto/appointment-slot.dto';
import { AvailabilityRequestDto } from './dto/availability-request.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
	constructor(private readonly appointmentsService: AppointmentsService) {}

	@Post()
	create(@Body() createAppointmentDto: CreateAppointmentDto) {
		return this.appointmentsService.create(createAppointmentDto);
	}

	@Get()
	findAll() {
		return this.appointmentsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.appointmentsService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateAppointmentDto: UpdateAppointmentDto
	) {
		return this.appointmentsService.update(id, updateAppointmentDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.appointmentsService.remove(id);
	}

	@Get('user/:userId')
	findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
		return this.appointmentsService.findByUserId(userId);
	}

	@Get('specialist/:specialistId')
	findBySpecialistId(
		@Param('specialistId', ParseUUIDPipe) specialistId: string
	) {
		return this.appointmentsService.findBySpecialistId(specialistId);
	}

	@Post('availability')
	async getAvailability(
		@Body() availabilityRequest: AvailabilityRequestDto
	): Promise<AppointmentSlotDto[]> {
		const targetDate = new Date(availabilityRequest.date);
		return this.appointmentsService.generateAvailableSlots(
			availabilityRequest.specialistId,
			availabilityRequest.serviceId,
			targetDate,
			availabilityRequest.slotIntervalMinutes || 15
		);
	}
}
