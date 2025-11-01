import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

	async create(dto: CreateServiceDto): Promise<Service> {
		const tenant = await this.findTenant(dto.tenantId);
		const specialists = await this.findSpecialists(
			dto.specialistIds,
			dto.tenantId
		);

		const service = this.serviceRepository.create({
			...dto,
			tenant: tenant,
			specialists: specialists,
		});

		return this.serviceRepository.save(service);
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

	async update(id: string, dto: UpdateServiceDto): Promise<Service> {
		const service = await this.findOne(id);
		const { tenantId, specialistIds, ...updateData } = dto;
		const updatedService = this.serviceRepository.merge(service, updateData);

		if (tenantId) {
			updatedService.tenant = await this.findTenant(tenantId);
		}
		if (specialistIds) {
			const specialists = await this.findSpecialists(
				specialistIds,
				tenantId ?? service.tenant.id
			);
			updatedService.specialists = specialists;
		}
		return this.serviceRepository.save(updatedService);
	}

	async remove(id: string): Promise<void> {
		const service = await this.findOne(id);
		if (!service) {
			throw new NotFoundException(`Service with ID ${id} not found`);
		}
		await this.serviceRepository.remove(service);
	}

	// === HELPER METHODS (PRIVATE) ===

	private async findTenant(tenantId: string): Promise<Tenant> {
		const tenant = await this.tenantRepository.findOne({
			where: { id: tenantId },
		});
		if (!tenant) {
			throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
		}
		return tenant;
	}

	private async findSpecialists(
		specialistIds: string[],
		tenantId: string
	): Promise<Specialist[]> {
		const specialists = await this.specialistRepository.find({
			where: { id: In(specialistIds), tenant: { id: tenantId } },
		});
		if (specialists.length !== specialistIds.length) {
			throw new NotFoundException(
				`Specialists with IDs ${specialistIds.join(', ')} not found`
			);
		}
		return specialists;
	}
}
