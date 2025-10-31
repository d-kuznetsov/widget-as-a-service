import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';
import { WorkingHours } from './entities/working-hours.entity';
import { WorkingHoursService } from './working-hours.service';

@ApiTags('working-hours')
@Controller('working-hours')
export class WorkingHoursController {
	constructor(private readonly workingHoursService: WorkingHoursService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create working hours for a specialist' })
	@ApiBody({
		type: CreateWorkingHoursDto,
		description: 'Working hours data',
		examples: {
			example1: {
				summary: 'Monday working hours',
				description: 'Example of Monday working hours from 9 AM to 5 PM',
				value: {
					dayOfWeek: 'monday',
					startTime: '09:00:00',
					endTime: '17:00:00',
					isActive: true,
					specialistId: '123e4567-e89b-12d3-a456-426614174000',
					tenantId: '123e4567-e89b-12d3-a456-426614174001',
				},
			},
			example2: {
				summary: 'Tuesday working hours',
				description: 'Example of Tuesday working hours from 10 AM to 6 PM',
				value: {
					dayOfWeek: 'tuesday',
					startTime: '10:00:00',
					endTime: '18:00:00',
					isActive: true,
					specialistId: '123e4567-e89b-12d3-a456-426614174000',
					tenantId: '123e4567-e89b-12d3-a456-426614174001',
				},
			},
		},
	})
	@ApiCreatedResponse({
		description: 'Working hours have been successfully created',
		type: WorkingHours,
	})
	@ApiResponse({
		status: 400,
		description:
			'Bad request - Invalid input data (e.g., start time must be before end time)',
	})
	@ApiResponse({
		status: 404,
		description: 'Not found - Specialist or tenant not found',
	})
	@ApiResponse({
		status: 409,
		description:
			'Conflict - Working hours already exist for this specialist on the specified day',
	})
	create(@Body() createWorkingHoursDto: CreateWorkingHoursDto) {
		return this.workingHoursService.create(createWorkingHoursDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all working hours' })
	@ApiOkResponse({
		description: 'List of all working hours',
		type: WorkingHours,
		isArray: true,
	})
	findAll() {
		return this.workingHoursService.findAll();
	}

	@Get('specialist/:specialistId')
	@ApiOperation({ summary: 'Get working hours for a specific specialist' })
	@ApiParam({
		name: 'specialistId',
		description: 'Specialist ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiOkResponse({
		description: 'List of working hours for the specialist',
		type: WorkingHours,
		isArray: true,
	})
	findBySpecialist(@Param('specialistId', ParseUUIDPipe) specialistId: string) {
		return this.workingHoursService.findBySpecialist(specialistId);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get working hours by ID' })
	@ApiParam({
		name: 'id',
		description: 'Working hours ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiOkResponse({
		description: 'Working hours found',
		type: WorkingHours,
	})
	@ApiResponse({
		status: 404,
		description: 'Working hours not found',
	})
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.workingHoursService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update working hours' })
	@ApiParam({
		name: 'id',
		description: 'Working hours ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiOkResponse({
		description: 'Working hours have been successfully updated',
		type: WorkingHours,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - Invalid input data',
	})
	@ApiResponse({
		status: 404,
		description: 'Not found - Working hours, specialist, or tenant not found',
	})
	@ApiResponse({
		status: 409,
		description:
			'Conflict - Working hours already exist for this specialist on the specified day',
	})
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateWorkingHoursDto: UpdateWorkingHoursDto
	) {
		return this.workingHoursService.update(id, updateWorkingHoursDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete working hours' })
	@ApiParam({
		name: 'id',
		description: 'Working hours ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiNoContentResponse({
		description: 'Working hours have been successfully deleted',
	})
	@ApiResponse({
		status: 404,
		description: 'Working hours not found',
	})
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.workingHoursService.remove(id);
	}
}
