import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';
import { getSeedConfig } from './seed-config';
import { rolesSeedData } from './seed-data/roles.seed';
import { usersSeedData } from './seed-data/users.seed';

@Injectable()
export class SeederService {
	private readonly logger = new Logger(SeederService.name);

	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
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

	async clearDatabase(): Promise<void> {
		this.logger.log('Clearing database...');

		// Clear in reverse order due to foreign key constraints
		// Use clear() method instead of delete({}) for clearing all records
		await this.userRepository.clear();
		await this.roleRepository.clear();

		this.logger.log('Database cleared successfully!');
	}
}
