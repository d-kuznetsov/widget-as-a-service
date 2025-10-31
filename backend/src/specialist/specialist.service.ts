import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/entities/tenant.entity';
import { User } from '../users/user.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { Specialist } from './entities/specialist.entity';

@Injectable()
export class SpecialistService {
	constructor(
		@InjectRepository(Specialist)
		private specialistRepository: Repository<Specialist>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Tenant)
		private tenantRepository: Repository<Tenant>
	) {}

	async create(createSpecialistDto: CreateSpecialistDto): Promise<Specialist> {
		const { tenantId, userId, ...specialistData } = createSpecialistDto;
		const tenant = await this.findTenant(tenantId);

		const specialist = this.specialistRepository.create({
			...specialistData,
			tenant,
		});

		if (userId) {
			const user = await this.findUser(userId);
			specialist.user = user;
		}

		return this.specialistRepository.save(specialist);
	}

	findAll(): Promise<Specialist[]> {
		return this.specialistRepository.find({
			relations: ['user', 'tenant'],
		});
	}

	async findOne(id: string): Promise<Specialist> {
		const specialist = await this.specialistRepository.findOne({
			where: { id },
			relations: ['user', 'tenant'],
		});
		if (!specialist) {
			throw new NotFoundException(`Specialist with ID ${id} not found`);
		}
		return specialist;
	}

	async update(
		id: string,
		updateSpecialistDto: UpdateSpecialistDto
	): Promise<Specialist> {
		const specialist = await this.findOne(id);

		const { tenantId, userId, ...specialistData } = updateSpecialistDto;
		this.specialistRepository.merge(specialist, specialistData);
		if (tenantId) {
			const tenant = await this.findTenant(tenantId);
			specialist.tenant = tenant;
		}
		if (userId) {
			const user = await this.findUser(userId);
			specialist.user = user;
		}

		return this.specialistRepository.save(specialist);
	}

	async remove(id: string): Promise<Specialist> {
		const specialist = await this.findOne(id);
		if (!specialist) {
			throw new NotFoundException(`Specialist with ID ${id} not found`);
		}
		return this.specialistRepository.remove(specialist);
	}

	async findTenant(tenantId: string): Promise<Tenant> {
		const tenant = await this.tenantRepository.findOne({
			where: { id: tenantId },
		});
		if (!tenant) {
			throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
		}
		return tenant;
	}

	async findUser(userId: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException(`User with ID ${userId} not found`);
		}
		return user;
	}
}
