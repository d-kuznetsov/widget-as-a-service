import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Role)
		private rolesRepository: Repository<Role>
	) {}

	private readonly userSelectFields: (keyof User)[] = [
		'id',
		'username',
		'email',
		'passwordHash',
		'isActive',
		'createdAt',
		'updatedAt',
		'roles',
	];

	async findOne(username: string): Promise<User | null> {
		return this.usersRepository.findOne({
			select: this.userSelectFields,
			where: { username },
			relations: ['roles'],
		});
	}

	async findById(id: string): Promise<User | null> {
		return this.usersRepository.findOne({
			select: this.userSelectFields,
			where: { id },
			relations: ['roles'],
		});
	}

	async create(
		username: string,
		email: string,
		password: string
	): Promise<User> {
		const passwordHash = await bcrypt.hash(password, 10);
		const user = this.usersRepository.create({
			username,
			email,
			passwordHash,
		});

		try {
			return await this.usersRepository.save(user);
		} catch (error) {
			if (error instanceof QueryFailedError) {
				// Check if it's a unique constraint violation
				if (error.message.includes('UNIQUE constraint failed')) {
					if (error.message.includes('users.email')) {
						throw new ConflictException(
							'A user with this email already exists'
						);
					}
					if (error.message.includes('users.username')) {
						throw new ConflictException(
							'A user with this username already exists'
						);
					}
				}
			}
			throw error;
		}
	}

	async validatePassword(user: User, password: string): Promise<boolean> {
		return bcrypt.compare(password, user.passwordHash);
	}

	async assignRole(userId: string, roleId: string): Promise<void> {
		const user = await this.usersRepository.findOne({
			where: { id: userId },
			relations: ['roles'],
		});

		if (!user) {
			throw new Error('User not found');
		}

		// Check if user already has this role
		const hasRole = user.roles.some((role) => role.id === roleId);
		if (!hasRole) {
			const role = await this.rolesRepository.findOne({
				where: { id: roleId },
			});
			if (role) {
				user.roles.push(role);
				await this.usersRepository.save(user);
			}
		}
	}

	async createWithRole(
		username: string,
		email: string,
		password: string,
		roleName: string
	): Promise<User> {
		try {
			// Create the user first
			const user = await this.create(username, email, password);

			// Find the specified role
			const role = await this.rolesRepository.findOne({
				where: { name: roleName },
			});

			if (!role) {
				throw new Error(`Role '${roleName}' not found`);
			}

			// Assign the role to the user
			await this.assignRole(user.id, role.id);

			return user;
		} catch (error) {
			// Re-throw ConflictException from create method
			if (error instanceof ConflictException) {
				throw error;
			}
			// Re-throw other errors
			throw error;
		}
	}
}
