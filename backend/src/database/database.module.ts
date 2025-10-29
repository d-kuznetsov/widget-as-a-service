import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Exception } from '../exceptions/entities/exception.entity';
import { Service } from '../services/entities/service.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { User } from '../users/user.entity';
import { WorkingHours } from '../working-hours/entities/working-hours.entity';
import { SeederService } from './seeder.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			Service,
			Specialist,
			Tenant,
			WorkingHours,
			Appointment,
			Exception,
		]),
	],
	providers: [SeederService],
	exports: [SeederService],
})
export class DatabaseModule {}
