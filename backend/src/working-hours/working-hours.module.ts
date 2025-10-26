import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHours } from './entities/working-hours.entity';
import { WorkingHoursController } from './working-hours.controller';
import { WorkingHoursService } from './working-hours.service';

@Module({
	imports: [TypeOrmModule.forFeature([WorkingHours])],
	controllers: [WorkingHoursController],
	providers: [WorkingHoursService],
	exports: [WorkingHoursService],
})
export class WorkingHoursModule {}
