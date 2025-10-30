import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ROLES, type RoleName } from '../roles/role.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {}

	async create(createUserData: CreateUserDto): Promise<User> {
		const existsEmail = await this.usersRepository.existsBy({
			email: createUserData.email,
		});
		if (existsEmail) {
			throw new ConflictException('Email already exists');
		}

		const existsUsername = await this.usersRepository.existsBy({
			username: createUserData.username,
		});
		if (existsUsername) {
			throw new ConflictException('Username already exists');
		}

		const passwordHash = await bcrypt.hash(createUserData.password, 10);
		const user = this.usersRepository.create({
			...createUserData,
			passwordHash,
		});

		return this.usersRepository.save(user);
	}

	async findAll(): Promise<User[]> {
		return this.usersRepository.find({});
	}

	async findOne(username: string): Promise<User | null> {
		return this.usersRepository.findOne({
			where: { username },
		});
	}

	async findById(id: string): Promise<User | null> {
		return this.usersRepository.findOne({
			where: { id },
		});
	}

	async update(id: string, updates: UpdateUserDto): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const { password, ...otherUpdates } = updates;

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

	async validatePassword(user: User, password: string): Promise<boolean> {
		return bcrypt.compare(password, user.passwordHash);
	}
}
