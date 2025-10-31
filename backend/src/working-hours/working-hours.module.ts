import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { WorkingHours } from './entities/working-hours.entity';
import { WorkingHoursController } from './working-hours.controller';
import { WorkingHoursService } from './working-hours.service';

@Module({
	imports: [TypeOrmModule.forFeature([WorkingHours, Specialist, Tenant])],
	controllers: [WorkingHoursController],
	providers: [WorkingHoursService],
	exports: [WorkingHoursService],
})
export class WorkingHoursModule {}
