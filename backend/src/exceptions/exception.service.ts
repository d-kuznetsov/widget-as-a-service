import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { CreateExceptionDto } from './dto/create-exception.dto';
import { UpdateExceptionDto } from './dto/update-exception.dto';
import { Exception } from './entities/exception.entity';

@Injectable()
export class ExceptionService {
	constructor(
		@InjectRepository(Exception)
		private exceptionRepository: Repository<Exception>,
		@InjectRepository(Specialist)
		private specialistRepository: Repository<Specialist>,
		@InjectRepository(Tenant)
		private tenantRepository: Repository<Tenant>
	) {}

	async create(dto: CreateExceptionDto): Promise<Exception> {
		const tenant = await this.findTenant(dto.tenantId);
		const specialist = await this.findSpecialist(
			dto.specialistId,
			dto.tenantId
		);

		await this.checkForOverlaps({
			specialistId: dto.specialistId,
			tenantId: dto.tenantId,
			date: dto.date,
			startTime: dto.startTime,
			endTime: dto.endTime,
		});

		const exception = this.exceptionRepository.create({
			...dto,
			date: new Date(dto.date),
			specialist: specialist,
			tenant: tenant,
		});
		return this.exceptionRepository.save(exception);
	}

	async findAll(): Promise<Exception[]> {
		return this.exceptionRepository.find({
			relations: ['specialist', 'tenant'],
		});
	}

	async findOne(id: string): Promise<Exception> {
		const exception = await this.exceptionRepository.findOne({
			where: { id },
			relations: ['specialist', 'tenant'],
		});

		if (!exception) {
			throw new NotFoundException(`Exception with ID ${id} not found`);
		}

		return exception;
	}

	async update(id: string, dto: UpdateExceptionDto): Promise<Exception> {
		const exception = await this.findOne(id);
		await this.checkForOverlaps({
			specialistId: dto.specialistId ?? exception.specialist.id,
			tenantId: dto.tenantId ?? exception.tenant.id,
			date: dto.date ?? exception.date.toISOString().split('T')[0],
			startTime: dto.startTime ?? exception.startTime,
			endTime: dto.endTime ?? exception.endTime,
			excludeId: id,
		});
		const tenant = await this.findTenant(dto.tenantId ?? exception.tenant.id);
		const specialist = await this.findSpecialist(
			dto.specialistId ?? exception.specialist.id,
			dto.tenantId ?? exception.tenant.id
		);

		this.exceptionRepository.merge(exception, {
			...dto,
			specialist: specialist,
			tenant: tenant,
		});
		return this.exceptionRepository.save(exception);
	}

	async remove(id: string): Promise<void> {
		const exception = await this.findOne(id);
		await this.exceptionRepository.remove(exception);
	}

	async findBySpecialist(specialistId: string): Promise<Exception[]> {
		return this.exceptionRepository.find({
			where: { specialist: { id: specialistId } },
			relations: ['specialist', 'tenant'],
		});
	}

	async findByDateRange(
		startDate: string,
		endDate: string
	): Promise<Exception[]> {
		return this.exceptionRepository
			.createQueryBuilder('exception')
			.leftJoinAndSelect('exception.specialist', 'specialist')
			.leftJoinAndSelect('exception.tenant', 'tenant')
			.where('exception.date >= :startDate', { startDate })
			.andWhere('exception.date <= :endDate', { endDate })
			.orderBy('exception.date', 'ASC')
			.addOrderBy('exception.startTime', 'ASC')
			.getMany();
	}

	private async checkForOverlaps(options: {
		specialistId: string;
		tenantId: string;
		date: string;
		startTime: string;
		endTime: string;
		excludeId?: string;
	}): Promise<void> {
		const query = this.exceptionRepository
			.createQueryBuilder('exception')
			.where('exception.specialist.id = :specialistId', {
				specialistId: options.specialistId,
			})
			.andWhere('exception.tenant.id = :tenantId', {
				tenantId: options.tenantId,
			})
			.andWhere('exception.date = :date', { date: options.date })
			.andWhere(
				'(exception.startTime < :endTime AND exception.endTime > :startTime)',
				{ startTime: options.startTime, endTime: options.endTime }
			);

		if (options.excludeId) {
			query.andWhere('exception.id != :excludeId', {
				excludeId: options.excludeId,
			});
		}

		const overlappingExceptions = await query.getMany();

		if (overlappingExceptions.length > 0) {
			throw new ConflictException(
				'Exception overlaps with existing exception for the same specialist and tenant on the same date'
			);
		}
	}

	private async findSpecialist(
		specialistId: string,
		tenantId: string
	): Promise<Specialist> {
		const specialist = await this.specialistRepository.findOne({
			where: { id: specialistId, tenant: { id: tenantId } },
		});
		if (!specialist) {
			throw new NotFoundException(
				`Specialist with ID ${specialistId} for tenant ID ${tenantId} not found`
			);
		}
		return specialist;
	}

	private async findTenant(id: string): Promise<Tenant> {
		const tenant = await this.tenantRepository.findOne({ where: { id } });
		if (!tenant) {
			throw new NotFoundException(`Tenant with ID ${id} not found`);
		}
		return tenant;
	}
}
