import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Exception } from '../exceptions/entities/exception.entity';
import { Role } from '../roles/role.entity';
import { Service } from '../services/entities/service.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { User } from '../users/user.entity';
import { WorkingHours } from '../working-hours/entities/working-hours.entity';
import { getSeedConfig } from './seed-config';
import { appointmentsSeedData } from './seed-data/appointments.seed';
import { exceptionsSeedData } from './seed-data/exceptions.seed';
import { rolesSeedData } from './seed-data/roles.seed';
import { servicesSeedData } from './seed-data/services.seed';
import { specialistsSeedData } from './seed-data/specialists.seed';
import { tenantsSeedData } from './seed-data/tenants.seed';
import { usersSeedData } from './seed-data/users.seed';
import { workingHoursSeedData } from './seed-data/working-hours.seed';

@Injectable()
export class SeederService {
	private readonly logger = new Logger(SeederService.name);

	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Service)
		private readonly serviceRepository: Repository<Service>,
		@InjectRepository(Specialist)
		private readonly specialistRepository: Repository<Specialist>,
		@InjectRepository(WorkingHours)
		private readonly workingHoursRepository: Repository<WorkingHours>,
		@InjectRepository(Appointment)
		private readonly appointmentRepository: Repository<Appointment>,
		@InjectRepository(Exception)
		private readonly exceptionRepository: Repository<Exception>,
		@InjectRepository(Tenant)
		private readonly tenantRepository: Repository<Tenant>
	) {}

	async seed(): Promise<void> {
		const config = getSeedConfig();
		this.logger.log(
			`Starting database seeding for ${process.env.NODE_ENV || 'development'} environment...`
		);

		try {
			if (config.clearBeforeSeed) {
				await this.clearDatabase();
			}

			if (config.roles) {
				await this.seedRoles();
			}

			if (config.users) {
				await this.seedUsers();
			}

			if (config.tenants) {
				await this.seedTenants();
			}

			if (config.services) {
				await this.seedServices();
			}

			if (config.specialists) {
				await this.seedSpecialists();
			}

			if (config.workingHours) {
				await this.seedWorkingHours();
			}

			if (config.appointments) {
				await this.seedAppointments();
			}

			if (config.exceptions) {
				await this.seedExceptions();
			}

			this.logger.log('Database seeding completed successfully!');
		} catch (error) {
			this.logger.error('Database seeding failed:', error);
			throw error;
		}
	}

	private async seedRoles(): Promise<void> {
		this.logger.log('Seeding roles...');

		for (const roleData of rolesSeedData) {
			const existingRole = await this.roleRepository.findOne({
				where: { name: roleData.name },
			});

			if (!existingRole) {
				const role = this.roleRepository.create(roleData);
				await this.roleRepository.save(role);
				this.logger.log(`Created role: ${roleData.name}`);
			} else {
				this.logger.log(`Role already exists: ${roleData.name}`);
			}
		}
	}

	private async seedUsers(): Promise<void> {
		this.logger.log('Seeding users...');

		for (const userData of usersSeedData) {
			const existingUser = await this.userRepository.findOne({
				where: [{ username: userData.username }, { email: userData.email }],
			});

			if (!existingUser) {
				// Find roles by names
				const roles = await this.roleRepository.find({
					where: userData.roleNames.map((name) => ({ name })),
				});

				if (roles.length !== userData.roleNames.length) {
					const foundRoleNames = roles.map((role) => role.name);
					const missingRoles = userData.roleNames.filter(
						(name) => !foundRoleNames.includes(name)
					);
					this.logger.warn(
						`Some roles not found for user ${userData.username}: ${missingRoles.join(', ')}`
					);
				}

				const passwordHash = await bcrypt.hash(userData.password, 10);
				const user = this.userRepository.create({
					username: userData.username,
					email: userData.email,
					passwordHash,
					roles,
				});

				await this.userRepository.save(user);
				this.logger.log(
					`Created user: ${userData.username} with roles: ${roles.map((r) => r.name).join(', ')}`
				);
			} else {
				this.logger.log(`User already exists: ${userData.username}`);
			}
		}
	}

	private async seedTenants(): Promise<void> {
		this.logger.log('Seeding tenants...');

		for (const tenantData of tenantsSeedData) {
			const existingTenant = await this.tenantRepository.findOne({
				where: { name: tenantData.name },
			});

			if (!existingTenant) {
				// Find owner by username
				const owner = await this.userRepository.findOne({
					where: { username: tenantData.ownerUsername },
				});

				if (!owner) {
					this.logger.warn(`Owner not found: ${tenantData.ownerUsername}`);
					continue;
				}

				const tenant = this.tenantRepository.create({
					name: tenantData.name,
					address: tenantData.address,
					owner,
				});

				await this.tenantRepository.save(tenant);
				this.logger.log(
					`Created tenant: ${tenantData.name} owned by ${tenantData.ownerUsername}`
				);
			} else {
				this.logger.log(`Tenant already exists: ${tenantData.name}`);
			}
		}
	}

	private async seedServices(): Promise<void> {
		this.logger.log('Seeding services...');

		// Get the first available tenant to assign to all services
		const tenant = await this.tenantRepository.findOne({
			where: {},
		});

		if (!tenant) {
			this.logger.warn('No tenant found. Skipping service seeding.');
			return;
		}

		for (const serviceData of servicesSeedData) {
			const existingService = await this.serviceRepository.findOne({
				where: { name: serviceData.name },
			});

			if (!existingService) {
				const service = this.serviceRepository.create({
					...serviceData,
					tenant,
				});
				await this.serviceRepository.save(service);
				this.logger.log(
					`Created service: ${serviceData.name} for tenant: ${tenant.name}`
				);
			} else {
				this.logger.log(`Service already exists: ${serviceData.name}`);
			}
		}
	}

	private async seedSpecialists(): Promise<void> {
		this.logger.log('Seeding specialists...');

		for (const specialistData of specialistsSeedData) {
			const existingSpecialist = await this.specialistRepository.findOne({
				where: { name: specialistData.name },
			});

			if (!existingSpecialist) {
				let user: User | null = null;
				if (specialistData.username) {
					user = await this.userRepository.findOne({
						where: { username: specialistData.username },
					});
				}

				const specialist = this.specialistRepository.create({
					name: specialistData.name,
					description: specialistData.description,
					user,
				});

				await this.specialistRepository.save(specialist);
				this.logger.log(`Created specialist: ${specialistData.name}`);
			} else {
				this.logger.log(`Specialist already exists: ${specialistData.name}`);
			}
		}
	}

	private async seedWorkingHours(): Promise<void> {
		this.logger.log('Seeding working hours...');

		for (const workingHoursData of workingHoursSeedData) {
			const specialist = await this.specialistRepository.findOne({
				where: { name: workingHoursData.specialistName },
			});

			if (!specialist) {
				this.logger.warn(
					`Specialist not found: ${workingHoursData.specialistName}`
				);
				continue;
			}

			const existingWorkingHours = await this.workingHoursRepository.findOne({
				where: {
					specialist: { id: specialist.id },
					dayOfWeek: workingHoursData.dayOfWeek,
				},
			});

			if (!existingWorkingHours) {
				const workingHours = this.workingHoursRepository.create({
					dayOfWeek: workingHoursData.dayOfWeek,
					startTime: workingHoursData.startTime,
					endTime: workingHoursData.endTime,
					isActive: workingHoursData.isActive,
					specialist,
				});

				await this.workingHoursRepository.save(workingHours);
				this.logger.log(
					`Created working hours for ${workingHoursData.specialistName} on ${workingHoursData.dayOfWeek}`
				);
			} else {
				this.logger.log(
					`Working hours already exist for ${workingHoursData.specialistName} on ${workingHoursData.dayOfWeek}`
				);
			}
		}
	}

	private async seedAppointments(): Promise<void> {
		this.logger.log('Seeding appointments...');

		for (const appointmentData of appointmentsSeedData) {
			const user = await this.userRepository.findOne({
				where: { email: appointmentData.userEmail },
			});

			const specialist = await this.specialistRepository.findOne({
				where: { name: appointmentData.specialistName },
			});

			const service = await this.serviceRepository.findOne({
				where: { name: appointmentData.serviceName },
			});

			if (!user) {
				this.logger.warn(`User not found: ${appointmentData.userEmail}`);
				continue;
			}

			if (!specialist) {
				this.logger.warn(
					`Specialist not found: ${appointmentData.specialistName}`
				);
				continue;
			}

			if (!service) {
				this.logger.warn(`Service not found: ${appointmentData.serviceName}`);
				continue;
			}

			const existingAppointment = await this.appointmentRepository.findOne({
				where: {
					user: { id: user.id },
					specialist: { id: specialist.id },
					startTime: new Date(appointmentData.startTime),
				},
			});

			if (!existingAppointment) {
				const appointment = this.appointmentRepository.create({
					startTime: new Date(appointmentData.startTime),
					endTime: new Date(appointmentData.endTime),
					status: appointmentData.status,
					comment: appointmentData.comment,
					user,
					specialist,
					service,
				});

				await this.appointmentRepository.save(appointment);
				this.logger.log(
					`Created appointment for ${appointmentData.userEmail} with ${appointmentData.specialistName}`
				);
			} else {
				this.logger.log(
					`Appointment already exists for ${appointmentData.userEmail} with ${appointmentData.specialistName}`
				);
			}
		}
	}

	private async seedExceptions(): Promise<void> {
		this.logger.log('Seeding exceptions...');

		for (const exceptionData of exceptionsSeedData) {
			const specialist = await this.specialistRepository.findOne({
				where: { name: exceptionData.specialistName },
			});

			if (!specialist) {
				this.logger.warn(
					`Specialist not found: ${exceptionData.specialistName}`
				);
				continue;
			}

			const existingException = await this.exceptionRepository.findOne({
				where: {
					specialist: { id: specialist.id },
					date: new Date(exceptionData.date),
					startTime: exceptionData.startTime,
				},
			});

			if (!existingException) {
				const exception = this.exceptionRepository.create({
					date: new Date(exceptionData.date),
					startTime: exceptionData.startTime,
					endTime: exceptionData.endTime,
					reason: exceptionData.reason,
					specialist,
				});

				await this.exceptionRepository.save(exception);
				this.logger.log(
					`Created exception for ${exceptionData.specialistName} on ${exceptionData.date}`
				);
			} else {
				this.logger.log(
					`Exception already exists for ${exceptionData.specialistName} on ${exceptionData.date}`
				);
			}
		}
	}

	async clearDatabase(): Promise<void> {
		this.logger.log('Clearing database...');

		// Clear in reverse order due to foreign key constraints
		// Use clear() method instead of delete({}) for clearing all records
		await this.exceptionRepository.clear();
		await this.appointmentRepository.clear();
		await this.workingHoursRepository.clear();
		await this.specialistRepository.clear();
		await this.serviceRepository.clear();
		await this.tenantRepository.clear();
		await this.userRepository.clear();
		await this.roleRepository.clear();

		this.logger.log('Database cleared successfully!');
	}
}
