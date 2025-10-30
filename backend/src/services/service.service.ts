import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
	constructor(
		@InjectRepository(Service)
		private serviceRepository: Repository<Service>,
		@InjectRepository(Specialist)
		private specialistRepository: Repository<Specialist>,
		@InjectRepository(Tenant)
		private tenantRepository: Repository<Tenant>
	) {}

	async create(createServiceDto: CreateServiceDto): Promise<Service> {
		// Verify tenant exists
		const tenant = await this.tenantRepository.findOne({
			where: { id: createServiceDto.tenantId },
		});

		if (!tenant) {
			throw new NotFoundException(
				`Tenant with ID ${createServiceDto.tenantId} not found`
			);
		}

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
			tenant: tenant,
			specialists: specialists,
		});

		try {
			return await this.serviceRepository.save(service);
		} catch (error) {
			this.handleDatabaseError(error, createServiceDto.name);
		}
	}

	async findAll(): Promise<Service[]> {
		return this.serviceRepository.find({
			relations: ['specialists', 'tenant'],
		});
	}

	async findOne(id: string): Promise<Service> {
		const service = await this.serviceRepository.findOne({
			where: { id },
			relations: ['specialists', 'tenant'],
		});

		if (!service) {
			throw new NotFoundException(`Service with ID ${id} not found`);
		}

		return service;
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
		if (updateServiceDto.tenantId !== undefined) {
			// Verify tenant exists
			const tenant = await this.tenantRepository.findOne({
				where: { id: updateServiceDto.tenantId },
			});

			if (!tenant) {
				throw new NotFoundException(
					`Tenant with ID ${updateServiceDto.tenantId} not found`
				);
			}

			service.tenant = tenant;
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

		try {
			return await this.serviceRepository.save(service);
		} catch (error) {
			this.handleDatabaseError(error, updateServiceDto.name || service.name);
		}
	}

	async remove(id: string): Promise<void> {
		const service = await this.findOne(id);
		await this.serviceRepository.remove(service);
	}

	async findBySpecialistId(specialistId: string): Promise<Service[]> {
		return this.serviceRepository.find({
			where: { specialists: { id: specialistId } },
			relations: ['specialists', 'tenant'],
		});
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

	private handleDatabaseError(
		error: Error & { code?: string },
		serviceName: string
	): never {
		// Handle UNIQUE constraint violation for service name
		if (
			error.code === 'SQLITE_CONSTRAINT' &&
			error.message.includes('UNIQUE constraint failed: services.name')
		) {
			throw new ConflictException(
				`A service with the name "${serviceName}" already exists`
			);
		}
		// Re-throw other database errors
		throw error;
	}
}
