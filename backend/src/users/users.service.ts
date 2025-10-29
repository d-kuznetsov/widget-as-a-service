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

	async validatePassword(user: User, password: string): Promise<boolean> {
		return bcrypt.compare(password, user.passwordHash);
	}

	async create(
		username: string,
		email: string,
		password: string,
		roles: RoleName[]
	): Promise<User> {
		try {
			// Validate roles
			const allValid = roles.every((r) => Object.values(ROLES).includes(r));
			if (!allValid) {
				throw new Error('Invalid roles provided');
			}

			// Create the user with roles preset
			const passwordHash = await bcrypt.hash(password, 10);
			const user = this.usersRepository.create({
				username,
				email,
				passwordHash,
				roles,
			});

			return await this.usersRepository.save(user);
		} catch (error) {
			// Re-throw ConflictException from create if any
			if (error instanceof ConflictException) {
				throw error;
			}
			throw error;
		}
	}

	async update(
		id: string,
		updates: Partial<{
			username: string;
			email: string;
			password: string;
			isActive: boolean;
			roles: RoleName[];
		}>
	): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user) {
			throw new Error('User not found');
		}

		if (updates.username !== undefined) user.username = updates.username;
		if (updates.email !== undefined) user.email = updates.email;
		if (updates.isActive !== undefined) user.isActive = updates.isActive;
		if (updates.roles !== undefined) {
			// Validate roles if provided
			const allValid = updates.roles.every((r) =>
				Object.values(ROLES).includes(r)
			);
			if (!allValid) {
				throw new Error('Invalid roles provided');
			}
			user.roles = updates.roles;
		}
		if (updates.password !== undefined) {
			user.passwordHash = await bcrypt.hash(updates.password, 10);
		}

		return this.usersRepository.save(user);
	}
}
