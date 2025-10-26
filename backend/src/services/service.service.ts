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
		// Verify specialist exists
		const specialist = await this.specialistRepository.findOne({
			where: { id: createServiceDto.specialistId },
		});

		if (!specialist) {
			throw new NotFoundException(
				`Specialist with ID ${createServiceDto.specialistId} not found`
			);
		}

		const service = this.serviceRepository.create({
			name: createServiceDto.name,
			duration: createServiceDto.duration,
			price: createServiceDto.price,
			specialist: specialist,
		});

		return this.serviceRepository.save(service);
	}

	async findAll(): Promise<Service[]> {
		return this.serviceRepository.find({
			relations: ['specialist'],
		});
	}

	async findOne(id: string): Promise<Service> {
		const service = await this.serviceRepository.findOne({
			where: { id },
			relations: ['specialist'],
		});

		if (!service) {
			throw new NotFoundException(`Service with ID ${id} not found`);
		}

		return service;
	}

	async findBySpecialistId(specialistId: string): Promise<Service[]> {
		return this.serviceRepository.find({
			where: { specialist: { id: specialistId } },
			relations: ['specialist'],
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
		if (updateServiceDto.specialistId !== undefined) {
			const specialist = await this.specialistRepository.findOne({
				where: { id: updateServiceDto.specialistId },
			});

			if (!specialist) {
				throw new NotFoundException(
					`Specialist with ID ${updateServiceDto.specialistId} not found`
				);
			}

			service.specialist = specialist;
		}

		return this.serviceRepository.save(service);
	}

	async remove(id: string): Promise<void> {
		const service = await this.findOne(id);
		await this.serviceRepository.remove(service);
	}
}
