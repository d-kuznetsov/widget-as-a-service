import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './appointments/entities/appointment.entity';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { Exception } from './exceptions/entities/exception.entity';
import { ExceptionModule } from './exceptions/exception.module';
import { Role } from './roles/role.entity';
import { RolesModule } from './roles/roles.module';
import { Service } from './services/entities/service.entity';
import { ServiceModule } from './services/service.module';
import { Specialist } from './specialist/entities/specialist.entity';
import { SpecialistModule } from './specialist/specialist.module';
import { Tenant } from './tenant/entities/tenant.entity';
import { TenantModule } from './tenant/tenant.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { WorkingHours } from './working-hours/entities/working-hours.entity';
import { WorkingHoursModule } from './working-hours/working-hours.module';

const typeOrmModuleOptions: TypeOrmModuleOptions = {
	type: 'sqlite',
	database: process.env.DATABASE_PATH || 'src/database/db.sqlite',
	entities: [
		Role,
		User,
		Specialist,
		Service,
		Tenant,
		Appointment,
		WorkingHours,
		Exception,
	],
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
		TenantModule,
		AppointmentsModule,
		WorkingHoursModule,
		ExceptionModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
