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
		private readonly tenantRepository: Repository<Tenant>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
		const owner = await this.findTenantOwner(createTenantDto.ownerId);
		this.checkTenantAdminRole(owner);
		const tenant = this.tenantRepository.create({
			...createTenantDto,
			owner,
		});
		return this.tenantRepository.save(tenant);
	}

	async findOne(id: string): Promise<Tenant> {
		const tenant = await this.tenantRepository.findOne({
			where: { id },
		});
		if (!tenant) {
			throw new NotFoundException(`Tenant with ID ${id} not found`);
		}
		return tenant;
	}

	findAll(): Promise<Tenant[]> {
		return this.tenantRepository.find({
			relations: ['owner'],
		});
	}

	async update(id: string, updates: UpdateTenantDto): Promise<Tenant> {
		const tenant = await this.findOne(id);
		const { ownerId, ...otherUpdates } = updates;
		const updatedTenant = this.tenantRepository.merge(tenant, otherUpdates);

		if (ownerId) {
			const owner = await this.findTenantOwner(ownerId);
			this.checkTenantAdminRole(owner);
			updatedTenant.owner = owner;
		}

		return this.tenantRepository.save(updatedTenant);
	}

	async remove(id: string): Promise<Tenant> {
		const tenant = await this.findOne(id);
		if (!tenant) {
			throw new NotFoundException(`Tenant with ID ${id} not found`);
		}
		return this.tenantRepository.remove(tenant);
	}

	private async findTenantOwner(userId: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: userId } });

		if (!user) {
			throw new NotFoundException(`User not found`);
		}
		return user;
	}

	checkTenantAdminRole(user: User): void {
		const hasTenantAdminRole = user.roles.includes(ROLES.TENANT_ADMIN);
		if (!hasTenantAdminRole) {
			throw new BadRequestException(
				`User must have role '${ROLES.TENANT_ADMIN}' to be a tenant owner`
			);
		}
	}
}
