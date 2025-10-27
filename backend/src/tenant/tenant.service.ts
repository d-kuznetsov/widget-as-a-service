import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantService {
	constructor(
		@InjectRepository(Tenant)
		private readonly tenantRepository: Repository<Tenant>
	) {}

	async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
		const owner = await this.tenantRepository.manager.findOne(User, {
			where: { id: createTenantDto.ownerId },
		});

		if (!owner) {
			throw new NotFoundException(
				`User with ID ${createTenantDto.ownerId} not found`
			);
		}

		const tenant = this.tenantRepository.create({
			name: createTenantDto.name,
			address: createTenantDto.address,
			owner,
		});

		return await this.tenantRepository.save(tenant);
	}

	async findAll(): Promise<Tenant[]> {
		return await this.tenantRepository.find({
			relations: ['owner'],
		});
	}

	async findOne(id: string): Promise<Tenant> {
		const tenant = await this.tenantRepository.findOne({
			where: { id },
			relations: ['owner'],
		});

		if (!tenant) {
			throw new NotFoundException(`Tenant with ID ${id} not found`);
		}

		return tenant;
	}

	async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
		const tenant = await this.findOne(id);

		if (updateTenantDto.name) {
			tenant.name = updateTenantDto.name;
		}
		if (updateTenantDto.address) {
			tenant.address = updateTenantDto.address;
		}
		if (updateTenantDto.ownerId) {
			const owner = await this.tenantRepository.manager.findOne(User, {
				where: { id: updateTenantDto.ownerId },
			});
			if (owner) {
				tenant.owner = owner;
			}
		}

		return await this.tenantRepository.save(tenant);
	}

	async remove(id: string): Promise<void> {
		const tenant = await this.findOne(id);
		await this.tenantRepository.remove(tenant);
	}

	async findByOwner(ownerId: string): Promise<Tenant[]> {
		return await this.tenantRepository.find({
			where: { owner: { id: ownerId } },
			relations: ['owner'],
		});
	}
}
