import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { ROLES, RoleName } from '../roles/role.constants';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
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
		});
	}

	async findById(id: string): Promise<User | null> {
		return this.usersRepository.findOne({
			select: this.userSelectFields,
			where: { id },
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

	async assignRole(userId: string, roleName: RoleName): Promise<void> {
		const user = await this.usersRepository.findOne({
			where: { id: userId },
		});

		if (!user) {
			throw new Error('User not found');
		}

		// Check if user already has this role
		if (!user.roles.includes(roleName)) {
			user.roles.push(roleName);
			await this.usersRepository.save(user);
		}
	}

	async createWithRole(
		username: string,
		email: string,
		password: string,
		roleName: RoleName
	): Promise<User> {
		try {
			// Create the user first
			const user = await this.create(username, email, password);

			// Validate the role name
			if (!Object.values(ROLES).includes(roleName)) {
				throw new Error(`Invalid role '${roleName}'`);
			}

			// Assign the role to the user
			await this.assignRole(user.id, roleName);

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
