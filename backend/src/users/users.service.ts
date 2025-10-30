import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ROLES } from '../roles/role.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

	async findAll(): Promise<User[]> {
		return this.usersRepository.find({ select: this.userSelectFields });
	}

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

	async create(createUserData: CreateUserDto): Promise<User> {
		try {
			const allValid = createUserData.roles.every((r) =>
				Object.values(ROLES).includes(r)
			);
			if (!allValid) {
				throw new BadRequestException('Invalid roles provided');
			}

			// Check if username already exists
			const existingUserByUsername = await this.usersRepository.findOne({
				where: { username: createUserData.username },
			});
			if (existingUserByUsername) {
				throw new ConflictException('Username already exists');
			}

			// Check if email already exists
			const existingUserByEmail = await this.usersRepository.findOne({
				where: { email: createUserData.email },
			});
			if (existingUserByEmail) {
				throw new ConflictException('Email already exists');
			}

			const passwordHash = await bcrypt.hash(createUserData.password, 10);
			const user = this.usersRepository.create({
				username: createUserData.username,
				email: createUserData.email,
				passwordHash,
				roles: createUserData.roles,
			});

			return await this.usersRepository.save(user);
		} catch (error) {
			if (
				error instanceof ConflictException ||
				error instanceof BadRequestException
			) {
				throw error;
			}
			// Handle database constraint violations
			if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				if (error.message.includes('username')) {
					throw new ConflictException('Username already exists');
				}
				if (error.message.includes('email')) {
					throw new ConflictException('Email already exists');
				}
				throw new ConflictException(
					'User with this information already exists'
				);
			}
			throw error;
		}
	}

	async update(id: string, updates: UpdateUserDto): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const { password, ...otherUpdates } = updates;
		if (otherUpdates.roles) {
			const allValid = otherUpdates.roles.every((r) =>
				Object.values(ROLES).includes(r)
			);
			if (!allValid) {
				throw new BadRequestException('Invalid roles provided');
			}
		}

		const updatedUser = this.usersRepository.merge(user, otherUpdates);

		if (password) {
			updatedUser.passwordHash = await bcrypt.hash(password, 10);
		}

		return this.usersRepository.save(updatedUser);
	}

	async remove(id: string): Promise<void> {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		await this.usersRepository.remove(user);
	}
}
