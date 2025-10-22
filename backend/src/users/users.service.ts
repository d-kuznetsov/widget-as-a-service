import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Role } from "./enums/role.enum";

@Injectable()
export class UsersService {
	private users: User[] = [];
	private nextId = 1;

	constructor() {
		// Initialize with some sample users
		this.create({
			email: "admin@example.com",
			username: "admin",
			firstName: "Admin",
			lastName: "User",
			role: Role.ADMIN,
		});

		this.create({
			email: "user@example.com",
			username: "user",
			firstName: "Regular",
			lastName: "User",
			role: Role.USER,
		});
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		// Check if email already exists
		const existingUser = this.users.find(
			(user) => user.email === createUserDto.email,
		);
		if (existingUser) {
			throw new ConflictException("User with this email already exists");
		}

		// Check if username already exists
		const existingUsername = this.users.find(
			(user) => user.username === createUserDto.username,
		);
		if (existingUsername) {
			throw new ConflictException("User with this username already exists");
		}

		const user = new User({
			id: this.nextId.toString(),
			...createUserDto,
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		this.users.push(user);
		this.nextId++;
		return user;
	}

	async findAll(): Promise<User[]> {
		return this.users;
	}

	async findOne(id: string): Promise<User> {
		const user = this.users.find((user) => user.id === id);
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
		return user;
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return this.users.find((user) => user.email === email);
	}

	async findByUsername(username: string): Promise<User | undefined> {
		return this.users.find((user) => user.username === username);
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const userIndex = this.users.findIndex((user) => user.id === id);
		if (userIndex === -1) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		// Check for email conflicts if email is being updated
		if (
			updateUserDto.email &&
			updateUserDto.email !== this.users[userIndex].email
		) {
			const existingUser = this.users.find(
				(user) => user.email === updateUserDto.email && user.id !== id,
			);
			if (existingUser) {
				throw new ConflictException("User with this email already exists");
			}
		}

		// Check for username conflicts if username is being updated
		if (
			updateUserDto.username &&
			updateUserDto.username !== this.users[userIndex].username
		) {
			const existingUser = this.users.find(
				(user) => user.username === updateUserDto.username && user.id !== id,
			);
			if (existingUser) {
				throw new ConflictException("User with this username already exists");
			}
		}

		this.users[userIndex] = {
			...this.users[userIndex],
			...updateUserDto,
			updatedAt: new Date(),
		};

		return this.users[userIndex];
	}

	async remove(id: string): Promise<void> {
		const userIndex = this.users.findIndex((user) => user.id === id);
		if (userIndex === -1) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
		this.users.splice(userIndex, 1);
	}

	async deactivate(id: string): Promise<User> {
		const user = await this.findOne(id);
		user.isActive = false;
		user.updatedAt = new Date();
		return user;
	}

	async activate(id: string): Promise<User> {
		const user = await this.findOne(id);
		user.isActive = true;
		user.updatedAt = new Date();
		return user;
	}

	async findByRole(role: Role): Promise<User[]> {
		return this.users.filter((user) => user.role === role);
	}
}
