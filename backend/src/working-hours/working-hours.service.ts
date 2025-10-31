import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';
import { DayOfWeek, WorkingHours } from './entities/working-hours.entity';

@Injectable()
export class WorkingHoursService {
	constructor(
		@InjectRepository(WorkingHours)
		private workingHoursRepository: Repository<WorkingHours>,
		@InjectRepository(Specialist)
		private specialistRepository: Repository<Specialist>,
		@InjectRepository(Tenant)
		private tenantRepository: Repository<Tenant>
	) {}

	async create(dto: CreateWorkingHoursDto): Promise<WorkingHours> {
		await this.checkOverlapWorkingHours(dto.specialistId, dto.dayOfWeek);
		this.validateTimeRange(dto.startTime, dto.endTime);

		const { specialistId, tenantId, ...workingHoursData } = dto;
		const tenant = await this.findTenant(tenantId);
		const specialist = await this.findSpecialist(specialistId, tenantId);

		const workingHours = this.workingHoursRepository.create({
			...workingHoursData,
			specialist,
			tenant,
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

	async update(id: string, dto: UpdateWorkingHoursDto): Promise<WorkingHours> {
		const workingHours = await this.findOne(id);
		const { specialistId, tenantId, ...updateData } = dto;

		const startTime = dto.startTime ?? workingHours.startTime;
		const endTime = dto.endTime ?? workingHours.endTime;
		this.validateTimeRange(startTime, endTime);

		if (specialistId) {
			const specialist = await this.findSpecialist(
				specialistId,
				tenantId ?? workingHours.tenant.id
			);
			workingHours.specialist = specialist;
		}
		if (tenantId) {
			const tenant = await this.findTenant(tenantId);
			workingHours.tenant = tenant;
		}

		await this.checkOverlapWorkingHours(
			specialistId ?? workingHours.specialist.id,
			dto.dayOfWeek ?? workingHours.dayOfWeek
		);

		this.workingHoursRepository.merge(workingHours, updateData);
		return this.workingHoursRepository.save(workingHours);
	}

	async remove(id: string): Promise<WorkingHours> {
		const workingHours = await this.findOne(id);
		if (!workingHours) {
			throw new NotFoundException(`Working hours with ID ${id} not found`);
		}
		return this.workingHoursRepository.remove(workingHours);
	}

	async findBySpecialist(specialistId: string): Promise<WorkingHours[]> {
		return this.workingHoursRepository.find({
			where: { specialist: { id: specialistId } },
			relations: ['specialist', 'tenant'],
		});
	}

	private validateTimeRange(startTime: string, endTime: string): void {
		const start = new Date(`1970-01-01T${startTime}`);
		const end = new Date(`1970-01-01T${endTime}`);

		if (start >= end) {
			throw new BadRequestException('Start time must be before end time');
		}
	}

	private async checkOverlapWorkingHours(
		specialistId: string,
		dayOfWeek: DayOfWeek
	): Promise<void> {
		const existWorkingHours = await this.workingHoursRepository.existsBy({
			specialist: { id: specialistId },
			dayOfWeek,
		});
		if (existWorkingHours) {
			throw new ConflictException(
				`Working hours already exist for this specialist on ${dayOfWeek}`
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
