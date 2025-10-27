import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserWithRoleDto } from './dto/create-user-with-role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('create-with-role')
	@HttpCode(HttpStatus.CREATED)
	async createWithRole(@Body() createUserWithRoleDto: CreateUserWithRoleDto) {
		const { username, email, password, roleName } = createUserWithRoleDto;
		return this.usersService.createWithRole(
			username,
			email,
			password,
			roleName
		);
	}
}
