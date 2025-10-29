import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLES } from '../roles/role.constants';
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

	private async validateTenantAdminRole(userEmail: string): Promise<User> {
		const user = await this.tenantRepository.manager.findOne(User, {
			where: { email: userEmail },
		});

		if (!user) {
			throw new NotFoundException(`User with email ${userEmail} not found`);
		}
		const hasTenantAdminRole = user.roles.includes(ROLES.TENANT_ADMIN);

		if (!hasTenantAdminRole) {
			throw new BadRequestException(
				`User with email ${userEmail} must have the '${ROLES.TENANT_ADMIN}' role to be a tenant owner`
			);
		}

		return user;
	}

	async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
		// Validate that the owner has tenant_admin role and get the user
		const owner = await this.validateTenantAdminRole(
			createTenantDto.ownerEmail
		);

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
		if (updateTenantDto.ownerEmail) {
			// Validate that the new owner has tenant_admin role and get the user
			const owner = await this.validateTenantAdminRole(
				updateTenantDto.ownerEmail
			);
			tenant.owner = owner;
		}

		return await this.tenantRepository.save(tenant);
	}

	async remove(id: string): Promise<void> {
		const tenant = await this.findOne(id);

		// Check for linked entities
		const linkedEntities = await this.checkForLinkedEntities(id);

		if (linkedEntities.length > 0) {
			throw new BadRequestException(
				`Cannot delete tenant. It has linked ${linkedEntities.join(', ')}. Please remove these entities first.`
			);
		}

		await this.tenantRepository.remove(tenant);
	}

	async findByOwner(ownerId: string): Promise<Tenant[]> {
		return await this.tenantRepository.find({
			where: { owner: { id: ownerId } },
			relations: ['owner'],
		});
	}

	private async checkForLinkedEntities(tenantId: string): Promise<string[]> {
		const linkedEntities: string[] = [];

		// Check specialists
		const specialistCount = await this.tenantRepository.manager.count(
			'Specialist',
			{
				where: { tenant: { id: tenantId } },
			}
		);
		if (specialistCount > 0) linkedEntities.push('specialists');

		// Check services
		const serviceCount = await this.tenantRepository.manager.count('Service', {
			where: { tenant: { id: tenantId } },
		});
		if (serviceCount > 0) linkedEntities.push('services');

		// Check appointments
		const appointmentCount = await this.tenantRepository.manager.count(
			'Appointment',
			{
				where: { tenant: { id: tenantId } },
			}
		);
		if (appointmentCount > 0) linkedEntities.push('appointments');

		// Check exceptions
		const exceptionCount = await this.tenantRepository.manager.count(
			'Exception',
			{
				where: { tenant: { id: tenantId } },
			}
		);
		if (exceptionCount > 0) linkedEntities.push('exceptions');

		// Check working hours
		const workingHoursCount = await this.tenantRepository.manager.count(
			'WorkingHours',
			{
				where: { tenant: { id: tenantId } },
			}
		);
		if (workingHoursCount > 0) linkedEntities.push('working hours');

		return linkedEntities;
	}
}
