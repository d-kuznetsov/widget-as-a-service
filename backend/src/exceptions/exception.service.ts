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
		private exceptionRepository: Repository<Exception>
	) {}

	async create(createExceptionDto: CreateExceptionDto): Promise<Exception> {
		// Check for overlapping exceptions
		await this.checkForOverlaps(
			createExceptionDto.specialistId,
			createExceptionDto.tenantId,
			createExceptionDto.date,
			createExceptionDto.startTime,
			createExceptionDto.endTime
		);

		const exception = this.exceptionRepository.create({
			date: new Date(createExceptionDto.date),
			startTime: createExceptionDto.startTime,
			endTime: createExceptionDto.endTime,
			reason: createExceptionDto.reason,
			specialist: { id: createExceptionDto.specialistId } as Specialist,
			tenant: { id: createExceptionDto.tenantId } as Tenant,
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

	async update(
		id: string,
		updateExceptionDto: UpdateExceptionDto
	): Promise<Exception> {
		const exception = await this.findOne(id);

		// Check for overlapping exceptions if time-related fields are being updated
		if (
			updateExceptionDto.date ||
			updateExceptionDto.startTime ||
			updateExceptionDto.endTime ||
			updateExceptionDto.specialistId ||
			updateExceptionDto.tenantId
		) {
			const checkDate =
				updateExceptionDto.date ||
				(exception.date instanceof Date
					? exception.date.toISOString().split('T')[0]
					: exception.date);
			const checkStartTime =
				updateExceptionDto.startTime || exception.startTime;
			const checkEndTime = updateExceptionDto.endTime || exception.endTime;
			const checkSpecialistId =
				updateExceptionDto.specialistId || exception.specialist.id;
			const checkTenantId = updateExceptionDto.tenantId || exception.tenant.id;

			await this.checkForOverlaps(
				checkSpecialistId,
				checkTenantId,
				checkDate,
				checkStartTime,
				checkEndTime,
				id // Exclude current exception from overlap check
			);
		}

		// Prepare update data with proper type conversion
		const updateData: Partial<Exception> = {};

		if (updateExceptionDto.date) {
			updateData.date = new Date(updateExceptionDto.date);
		}
		if (updateExceptionDto.startTime) {
			updateData.startTime = updateExceptionDto.startTime;
		}
		if (updateExceptionDto.endTime) {
			updateData.endTime = updateExceptionDto.endTime;
		}
		if (updateExceptionDto.reason) {
			updateData.reason = updateExceptionDto.reason;
		}
		if (updateExceptionDto.specialistId) {
			updateData.specialist = {
				id: updateExceptionDto.specialistId,
			} as Specialist;
		}
		if (updateExceptionDto.tenantId) {
			updateData.tenant = {
				id: updateExceptionDto.tenantId,
			} as Tenant;
		}

		Object.assign(exception, updateData);
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

	private async checkForOverlaps(
		specialistId: string,
		tenantId: string,
		date: string,
		startTime: string,
		endTime: string,
		excludeId?: string
	): Promise<void> {
		const query = this.exceptionRepository
			.createQueryBuilder('exception')
			.where('exception.specialist.id = :specialistId', { specialistId })
			.andWhere('exception.tenant.id = :tenantId', { tenantId })
			.andWhere('exception.date = :date', { date })
			.andWhere(
				'(exception.startTime < :endTime AND exception.endTime > :startTime)',
				{ startTime, endTime }
			);

		if (excludeId) {
			query.andWhere('exception.id != :excludeId', { excludeId });
		}

		const overlappingExceptions = await query.getMany();

		if (overlappingExceptions.length > 0) {
			throw new ConflictException(
				'Exception overlaps with existing exception for the same specialist and tenant on the same date'
			);
		}
	}
}
