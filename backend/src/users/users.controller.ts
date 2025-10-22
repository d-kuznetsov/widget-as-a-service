import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import type { Role } from "./enums/role.enum";
import type { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto);
		return new UserResponseDto(user);
	}

	@Get()
	async findAll(@Query('role') role?: Role) {
		const users = role 
			? await this.usersService.findByRole(role)
			: await this.usersService.findAll();
		
		return users.map(user => new UserResponseDto(user));
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const user = await this.usersService.findOne(id);
		return new UserResponseDto(user);
	}

	@Patch(":id")
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		const user = await this.usersService.update(id, updateUserDto);
		return new UserResponseDto(user);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		await this.usersService.remove(id);
		return { message: 'User deleted successfully' };
	}

	@Patch(':id/deactivate')
	async deactivate(@Param('id') id: string) {
		const user = await this.usersService.deactivate(id);
		return new UserResponseDto(user);
	}

	@Patch(':id/activate')
	async activate(@Param('id') id: string) {
		const user = await this.usersService.activate(id);
		return new UserResponseDto(user);
	}
}
