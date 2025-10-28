import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';
import { WorkingHours } from './entities/working-hours.entity';

@Injectable()
export class WorkingHoursService {
	constructor(
		@InjectRepository(WorkingHours)
		private workingHoursRepository: Repository<WorkingHours>
	) {}

	async create(
		createWorkingHoursDto: CreateWorkingHoursDto
	): Promise<WorkingHours> {
		// Check if working hours already exist for this specialist on this day
		const existingWorkingHours = await this.workingHoursRepository.findOne({
			where: {
				specialist: { id: createWorkingHoursDto.specialistId },
				dayOfWeek: createWorkingHoursDto.dayOfWeek,
			},
		});

		if (existingWorkingHours) {
			throw new ConflictException(
				`Working hours already exist for this specialist on ${createWorkingHoursDto.dayOfWeek}`
			);
		}

		const workingHours = this.workingHoursRepository.create({
			...createWorkingHoursDto,
			specialist: { id: createWorkingHoursDto.specialistId },
			tenant: { id: createWorkingHoursDto.tenantId },
		});
		return this.workingHoursRepository.save(workingHours);
	}

	async findAll(): Promise<WorkingHours[]> {
		return this.workingHoursRepository.find({
			relations: ['specialist', 'tenant'],
		});
	}

	async findOne(id: string): Promise<WorkingHours> {
		const workingHours = await this.workingHoursRepository.findOne({
			where: { id },
			relations: ['specialist', 'tenant'],
		});

		if (!workingHours) {
			throw new NotFoundException(`Working hours with ID ${id} not found`);
		}

		return workingHours;
	}

	async findBySpecialist(specialistId: string): Promise<WorkingHours[]> {
		return this.workingHoursRepository.find({
			where: { specialist: { id: specialistId } },
			relations: ['specialist', 'tenant'],
		});
	}

	async update(
		id: string,
		updateWorkingHoursDto: UpdateWorkingHoursDto
	): Promise<WorkingHours> {
		const workingHours = await this.findOne(id);

		const updateData = { ...updateWorkingHoursDto };

		// Check for duplicate dayOfWeek if it's being updated
		if (
			updateData.dayOfWeek &&
			updateData.dayOfWeek !== workingHours.dayOfWeek
		) {
			const existingWorkingHours = await this.workingHoursRepository.findOne({
				where: {
					specialist: { id: workingHours.specialist.id },
					dayOfWeek: updateData.dayOfWeek,
				},
			});

			if (existingWorkingHours) {
				throw new ConflictException(
					`Working hours already exist for this specialist on ${updateData.dayOfWeek}`
				);
			}
		}

		const entityUpdateData: any = { ...updateData };

		if (updateData.specialistId) {
			entityUpdateData.specialist = { id: updateData.specialistId };
			delete entityUpdateData.specialistId;
		}

		if (updateData.tenantId) {
			entityUpdateData.tenant = { id: updateData.tenantId };
			delete entityUpdateData.tenantId;
		}

		Object.assign(workingHours, entityUpdateData);
		return this.workingHoursRepository.save(workingHours);
	}

	async remove(id: string): Promise<void> {
		const workingHours = await this.findOne(id);
		await this.workingHoursRepository.remove(workingHours);
	}
}
