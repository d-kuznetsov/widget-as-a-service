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
		// Fetch and validate tenant
		const tenant = await this.tenantRepository.findOne({
			where: { id: createSpecialistDto.tenantId },
		});

		if (!tenant) {
			throw new NotFoundException(
				`Tenant with ID ${createSpecialistDto.tenantId} not found`
			);
		}

		const specialist = this.specialistRepository.create({
			name: createSpecialistDto.name,
			description: createSpecialistDto.description,
			tenant,
		});

		// If userId is provided, fetch and assign the user
		if (createSpecialistDto.userId) {
			const user = await this.userRepository.findOne({
				where: { id: createSpecialistDto.userId },
			});

			if (!user) {
				throw new NotFoundException(
					`User with ID ${createSpecialistDto.userId} not found`
				);
			}

			specialist.user = user;
		}

		return this.specialistRepository.save(specialist);
	}

	async findAll(): Promise<Specialist[]> {
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

		if (updateSpecialistDto.name !== undefined) {
			specialist.name = updateSpecialistDto.name;
		}
		if (updateSpecialistDto.description !== undefined) {
			specialist.description = updateSpecialistDto.description;
		}
		if (updateSpecialistDto.tenantId !== undefined) {
			const tenant = await this.tenantRepository.findOne({
				where: { id: updateSpecialistDto.tenantId },
			});

			if (!tenant) {
				throw new NotFoundException(
					`Tenant with ID ${updateSpecialistDto.tenantId} not found`
				);
			}

			specialist.tenant = tenant;
		}
		if (updateSpecialistDto.userId !== undefined) {
			if (updateSpecialistDto.userId === null) {
				// Unassign user if null is explicitly provided
				specialist.user = null;
			} else {
				// Assign new user
				const user = await this.userRepository.findOne({
					where: { id: updateSpecialistDto.userId },
				});

				if (!user) {
					throw new NotFoundException(
						`User with ID ${updateSpecialistDto.userId} not found`
					);
				}

				specialist.user = user;
			}
		}

		return this.specialistRepository.save(specialist);
	}

	async remove(id: string): Promise<void> {
		const specialist = await this.findOne(id);
		await this.specialistRepository.remove(specialist);
	}

	async assignUser(specialistId: string, userId: string): Promise<Specialist> {
		const specialist = await this.findOne(specialistId);
		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException(`User with ID ${userId} not found`);
		}

		specialist.user = user;
		return this.specialistRepository.save(specialist);
	}

	async unassignUser(specialistId: string): Promise<Specialist> {
		const specialist = await this.findOne(specialistId);
		specialist.user = null;
		return this.specialistRepository.save(specialist);
	}
}
