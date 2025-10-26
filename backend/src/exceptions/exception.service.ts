import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
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
		const exception = this.exceptionRepository.create({
			date: new Date(createExceptionDto.date),
			startTime: createExceptionDto.startTime,
			endTime: createExceptionDto.endTime,
			reason: createExceptionDto.reason,
			specialist: { id: createExceptionDto.specialistId } as Specialist,
		});
		return this.exceptionRepository.save(exception);
	}

	async findAll(): Promise<Exception[]> {
		return this.exceptionRepository.find({
			relations: ['specialist'],
		});
	}

	async findOne(id: string): Promise<Exception> {
		const exception = await this.exceptionRepository.findOne({
			where: { id },
			relations: ['specialist'],
		});

		if (!exception) {
			throw new NotFoundException(`Exception with ID ${id} not found`);
		}

		return exception;
	}

	async findBySpecialist(specialistId: string): Promise<Exception[]> {
		return this.exceptionRepository.find({
			where: { specialist: { id: specialistId } },
			relations: ['specialist'],
		});
	}

	async findByDateRange(
		startDate: string,
		endDate: string
	): Promise<Exception[]> {
		return this.exceptionRepository
			.createQueryBuilder('exception')
			.leftJoinAndSelect('exception.specialist', 'specialist')
			.where('exception.date >= :startDate', { startDate })
			.andWhere('exception.date <= :endDate', { endDate })
			.orderBy('exception.date', 'ASC')
			.addOrderBy('exception.startTime', 'ASC')
			.getMany();
	}

	async update(
		id: string,
		updateExceptionDto: UpdateExceptionDto
	): Promise<Exception> {
		const exception = await this.findOne(id);

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

		Object.assign(exception, updateData);
		return this.exceptionRepository.save(exception);
	}

	async remove(id: string): Promise<void> {
		const exception = await this.findOne(id);
		await this.exceptionRepository.remove(exception);
	}
}
