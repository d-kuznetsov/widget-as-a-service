import { Injectable, NotFoundException } from '@nestjs/common';
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
		const workingHours = this.workingHoursRepository.create({
			...createWorkingHoursDto,
			specialist: { id: createWorkingHoursDto.specialistId },
		});
		return this.workingHoursRepository.save(workingHours);
	}

	async findAll(): Promise<WorkingHours[]> {
		return this.workingHoursRepository.find({
			relations: ['specialist'],
		});
	}

	async findOne(id: string): Promise<WorkingHours> {
		const workingHours = await this.workingHoursRepository.findOne({
			where: { id },
			relations: ['specialist'],
		});

		if (!workingHours) {
			throw new NotFoundException(`Working hours with ID ${id} not found`);
		}

		return workingHours;
	}

	async findBySpecialist(specialistId: string): Promise<WorkingHours[]> {
		return this.workingHoursRepository.find({
			where: { specialist: { id: specialistId } },
			relations: ['specialist'],
		});
	}

	async update(
		id: string,
		updateWorkingHoursDto: UpdateWorkingHoursDto
	): Promise<WorkingHours> {
		const workingHours = await this.findOne(id);

		const updateData: any = { ...updateWorkingHoursDto };

		if (updateData.specialistId) {
			updateData.specialist = { id: updateData.specialistId };
			delete updateData.specialistId;
		}

		Object.assign(workingHours, updateData);
		return this.workingHoursRepository.save(workingHours);
	}

	async remove(id: string): Promise<void> {
		const workingHours = await this.findOne(id);
		await this.workingHoursRepository.remove(workingHours);
	}
}
