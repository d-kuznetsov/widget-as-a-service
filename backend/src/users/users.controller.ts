import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new user' })
	@ApiCreatedResponse({
		description: 'User has been successfully created',
		type: UserResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - Invalid input data',
	})
	@ApiResponse({
		status: 409,
		description: 'Conflict - Username or email already exists',
	})
	async create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a user' })
	@ApiParam({
		name: 'id',
		description: 'User ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiOkResponse({
		description: 'User has been successfully updated',
		type: UserResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - Invalid input data',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a user' })
	@ApiParam({
		name: 'id',
		description: 'User ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiNoContentResponse({
		description: 'User has been successfully deleted',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.usersService.remove(id);
	}
}
