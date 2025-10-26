import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
	constructor(
		@InjectRepository(Service)
		private serviceRepository: Repository<Service>,
		@InjectRepository(Specialist)
		private specialistRepository: Repository<Specialist>
	) {}

	async create(createServiceDto: CreateServiceDto): Promise<Service> {
		// Verify all specialists exist
		const specialists = await this.specialistRepository.findByIds(
			createServiceDto.specialistIds
		);

		if (specialists.length !== createServiceDto.specialistIds.length) {
			const foundIds = specialists.map((s) => s.id);
			const missingIds = createServiceDto.specialistIds.filter(
				(id) => !foundIds.includes(id)
			);
			throw new NotFoundException(
				`Specialists with IDs ${missingIds.join(', ')} not found`
			);
		}

		const service = this.serviceRepository.create({
			name: createServiceDto.name,
			duration: createServiceDto.duration,
			price: createServiceDto.price,
			specialists: specialists,
		});

		return this.serviceRepository.save(service);
	}

	async findAll(): Promise<Service[]> {
		return this.serviceRepository.find({
			relations: ['specialists'],
		});
	}

	async findOne(id: string): Promise<Service> {
		const service = await this.serviceRepository.findOne({
			where: { id },
			relations: ['specialists'],
		});

		if (!service) {
			throw new NotFoundException(`Service with ID ${id} not found`);
		}

		return service;
	}

	async findBySpecialistId(specialistId: string): Promise<Service[]> {
		return this.serviceRepository.find({
			where: { specialists: { id: specialistId } },
			relations: ['specialists'],
		});
	}

	async update(
		id: string,
		updateServiceDto: UpdateServiceDto
	): Promise<Service> {
		const service = await this.findOne(id);

		if (updateServiceDto.name !== undefined) {
			service.name = updateServiceDto.name;
		}
		if (updateServiceDto.duration !== undefined) {
			service.duration = updateServiceDto.duration;
		}
		if (updateServiceDto.price !== undefined) {
			service.price = updateServiceDto.price;
		}
		if (updateServiceDto.specialistIds !== undefined) {
			// Verify all specialists exist
			const specialists = await this.specialistRepository.findByIds(
				updateServiceDto.specialistIds
			);

			if (specialists.length !== updateServiceDto.specialistIds.length) {
				const foundIds = specialists.map((s) => s.id);
				const missingIds = updateServiceDto.specialistIds.filter(
					(id) => !foundIds.includes(id)
				);
				throw new NotFoundException(
					`Specialists with IDs ${missingIds.join(', ')} not found`
				);
			}

			service.specialists = specialists;
		}

		return this.serviceRepository.save(service);
	}

	async remove(id: string): Promise<void> {
		const service = await this.findOne(id);
		await this.serviceRepository.remove(service);
	}

	async addSpecialistToService(
		serviceId: string,
		specialistId: string
	): Promise<Service> {
		const service = await this.findOne(serviceId);
		const specialist = await this.specialistRepository.findOne({
			where: { id: specialistId },
		});

		if (!specialist) {
			throw new NotFoundException(
				`Specialist with ID ${specialistId} not found`
			);
		}

		// Check if specialist is already assigned
		const isAlreadyAssigned = service.specialists.some(
			(s) => s.id === specialistId
		);
		if (!isAlreadyAssigned) {
			service.specialists.push(specialist);
			return this.serviceRepository.save(service);
		}

		return service;
	}

	async removeSpecialistFromService(
		serviceId: string,
		specialistId: string
	): Promise<Service> {
		const service = await this.findOne(serviceId);

		service.specialists = service.specialists.filter(
			(s) => s.id !== specialistId
		);
		return this.serviceRepository.save(service);
	}
}
