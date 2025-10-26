import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
	constructor(
		@InjectRepository(Appointment)
		private appointmentsRepository: Repository<Appointment>
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
}
