import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Exception } from '../exceptions/entities/exception.entity';
import { Service } from '../services/entities/service.entity';
import {
	DayOfWeek,
	WorkingHours,
} from '../working-hours/entities/working-hours.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
	constructor(
		@InjectRepository(Appointment)
		private appointmentsRepository: Repository<Appointment>,
		@InjectRepository(WorkingHours)
		private workingHoursRepository: Repository<WorkingHours>,
		@InjectRepository(Exception)
		private exceptionRepository: Repository<Exception>,
		@InjectRepository(Service)
		private serviceRepository: Repository<Service>
	) {}

	async create(
		createAppointmentDto: CreateAppointmentDto
	): Promise<Appointment> {
		const { user, specialist, service, ...appointmentData } =
			createAppointmentDto;
		const appointment = this.appointmentsRepository.create({
			...appointmentData,
			user: { id: user },
			specialist: { id: specialist },
			service: { id: service },
		});
		return this.appointmentsRepository.save(appointment);
	}

	async findAll(): Promise<Appointment[]> {
		return this.appointmentsRepository.find({
			relations: ['user', 'specialist', 'service'],
		});
	}

	async findOne(id: string): Promise<Appointment> {
		const appointment = await this.appointmentsRepository.findOne({
			where: { id },
			relations: ['user', 'specialist', 'service'],
		});

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		return appointment;
	}

	async update(
		id: string,
		updateAppointmentDto: UpdateAppointmentDto
	): Promise<Appointment> {
		const appointment = await this.findOne(id);
		Object.assign(appointment, updateAppointmentDto);
		return this.appointmentsRepository.save(appointment);
	}

	async remove(id: string): Promise<void> {
		const appointment = await this.findOne(id);
		await this.appointmentsRepository.remove(appointment);
	}

	async findByUserId(userId: string): Promise<Appointment[]> {
		return this.appointmentsRepository.find({
			where: { user: { id: userId } },
			relations: ['user', 'specialist', 'service'],
		});
	}

	async findBySpecialistId(specialistId: string): Promise<Appointment[]> {
		return this.appointmentsRepository.find({
			where: { specialist: { id: specialistId } },
			relations: ['user', 'specialist', 'service'],
		});
	}

	async generateAvailableSlots(
		specialistId: string,
		serviceId: string,
		targetDate: Date,
		slotIntervalMinutes: number = 15
	): Promise<Array<{ startTime: Date; endTime: Date; isAvailable: boolean }>> {
		const dayOfWeek = this.getDayOfWeek(targetDate);

		const workingHours = await this.workingHoursRepository.findOne({
			where: {
				specialist: { id: specialistId },
				dayOfWeek,
				isActive: true,
			},
			relations: ['specialist'],
		});

		if (!workingHours) {
			return [];
		}

		const service = await this.serviceRepository.findOne({
			where: { id: serviceId },
		});
		if (!service) {
			throw new NotFoundException('Service not found');
		}

		const existingAppointments = await this.appointmentsRepository.find({
			where: {
				specialist: { id: specialistId },
				startTime: Between(
					this.getStartOfDay(targetDate),
					this.getEndOfDay(targetDate)
				),
				status: In(['booked', 'completed']),
			},
		});

		const exceptions = await this.exceptionRepository.find({
			where: {
				specialist: { id: specialistId },
				date: this.toDateOnly(targetDate),
			},
		});

		return this.generateTimeSlots(
			workingHours,
			service.duration,
			existingAppointments,
			exceptions,
			slotIntervalMinutes,
			targetDate
		);
	}

	private generateTimeSlots(
		workingHours: WorkingHours,
		serviceDuration: number,
		existingAppointments: Appointment[],
		exceptions: Exception[],
		slotIntervalMinutes: number,
		targetDate: Date
	): Array<{ startTime: Date; endTime: Date; isAvailable: boolean }> {
		const slots: Array<{
			startTime: Date;
			endTime: Date;
			isAvailable: boolean;
		}> = [];

		const [startHour, startMinute] = workingHours.startTime
			.split(':')
			.map(Number);
		const [endHour, endMinute] = workingHours.endTime.split(':').map(Number);

		const workingStart = new Date(targetDate);
		workingStart.setHours(startHour, startMinute, 0, 0);

		const workingEnd = new Date(targetDate);
		workingEnd.setHours(endHour, endMinute, 0, 0);

		const currentTime = new Date(workingStart);

		while (currentTime < workingEnd) {
			const slotEnd = new Date(currentTime.getTime() + serviceDuration * 60000);

			if (slotEnd <= workingEnd) {
				const hasConflict = this.hasAppointmentConflict(
					currentTime,
					slotEnd,
					existingAppointments
				);
				const hasException = this.hasExceptionConflict(
					currentTime,
					slotEnd,
					exceptions
				);

				if (!hasConflict && !hasException) {
					slots.push({
						startTime: new Date(currentTime),
						endTime: new Date(slotEnd),
						isAvailable: true,
					});
				}
			}

			currentTime.setMinutes(currentTime.getMinutes() + slotIntervalMinutes);
		}

		return slots;
	}

	private hasAppointmentConflict(
		slotStart: Date,
		slotEnd: Date,
		existingAppointments: Appointment[]
	): boolean {
		return existingAppointments.some((appointment) => {
			return slotStart < appointment.endTime && slotEnd > appointment.startTime;
		});
	}

	private hasExceptionConflict(
		slotStart: Date,
		slotEnd: Date,
		exceptions: Exception[]
	): boolean {
		return exceptions.some((exception) => {
			const [startHour, startMinute] = exception.startTime
				.split(':')
				.map(Number);
			const [endHour, endMinute] = exception.endTime.split(':').map(Number);

			const exceptionStart = new Date(slotStart);
			exceptionStart.setHours(startHour, startMinute, 0, 0);

			const exceptionEnd = new Date(slotStart);
			exceptionEnd.setHours(endHour, endMinute, 0, 0);

			return slotStart < exceptionEnd && slotEnd > exceptionStart;
		});
	}

	private getDayOfWeek(date: Date): DayOfWeek {
		const days: Array<DayOfWeek> = [
			DayOfWeek.SUNDAY,
			DayOfWeek.MONDAY,
			DayOfWeek.TUESDAY,
			DayOfWeek.WEDNESDAY,
			DayOfWeek.THURSDAY,
			DayOfWeek.FRIDAY,
			DayOfWeek.SATURDAY,
		];
		return days[date.getDay()];
	}

	private getStartOfDay(date: Date): Date {
		const start = new Date(date);
		start.setHours(0, 0, 0, 0);
		return start;
	}

	private getEndOfDay(date: Date): Date {
		const end = new Date(date);
		end.setHours(23, 59, 59, 999);
		return end;
	}

	private toDateOnly(date: Date): Date {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d;
	}
}
