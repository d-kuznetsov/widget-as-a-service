// src/roles/roles.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private rolesRepository: Repository<Role>
	) {}

	async findAll(): Promise<Role[]> {
		return this.rolesRepository.find();
	}

	async findById(id: string): Promise<Role | null> {
		return this.rolesRepository.findOne({ where: { id } });
	}

	async findByName(name: string): Promise<Role | null> {
		return this.rolesRepository.findOne({ where: { name } });
	}

	async create(name: string, description?: string): Promise<Role> {
		const role = this.rolesRepository.create({ name, description });
		return this.rolesRepository.save(role);
	}

	async update(id: string, name?: string, description?: string): Promise<Role> {
		const role = await this.rolesRepository.findOne({ where: { id } });
		if (!role) {
			throw new Error('Role not found');
		}

		if (name) role.name = name;
		if (description !== undefined) role.description = description;

		return this.rolesRepository.save(role);
	}

	async delete(id: string): Promise<void> {
		await this.rolesRepository.delete(id);
	}
}
