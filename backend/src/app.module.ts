import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './appointments/entities/appointment.entity';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { Role } from './roles/role.entity';
import { RolesModule } from './roles/roles.module';
import { Service } from './services/entities/service.entity';
import { ServiceModule } from './services/service.module';
import { Specialist } from './specialist/entities/specialist.entity';
import { SpecialistModule } from './specialist/specialist.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { WorkingHours } from './working-hours/entities/working-hours.entity';
import { WorkingHoursModule } from './working-hours/working-hours.module';

const typeOrmModuleOptions: TypeOrmModuleOptions = {
	type: 'sqlite',
	database: process.env.DATABASE_PATH || 'src/database/db.sqlite',
	entities: [Role, User, Specialist, Service, Appointment, WorkingHours],
	synchronize: true,
	logging: true,
};

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => typeOrmModuleOptions,
		}),
		DatabaseModule,
		AuthModule,
		UsersModule,
		RolesModule,
		SpecialistModule,
		ServiceModule,
		AppointmentsModule,
		WorkingHoursModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
