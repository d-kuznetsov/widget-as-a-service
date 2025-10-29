import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exception } from '../exceptions/entities/exception.entity';
import { Service } from '../services/entities/service.entity';
import { WorkingHours } from '../working-hours/entities/working-hours.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Appointment, WorkingHours, Exception, Service]),
	],
	controllers: [AppointmentsController],
	providers: [AppointmentsService],
	exports: [AppointmentsService],
})
export class AppointmentsModule {}
