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
	Query,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateExceptionDto } from './dto/create-exception.dto';
import { UpdateExceptionDto } from './dto/update-exception.dto';
import { Exception } from './entities/exception.entity';
import { ExceptionService } from './exception.service';

@ApiTags('exceptions')
@Controller('exceptions')
export class ExceptionController {
	constructor(private readonly exceptionService: ExceptionService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new exception' })
	@ApiBody({
		type: CreateExceptionDto,
		description: 'Exception data',
		examples: {
			example1: {
				summary: 'Holiday exception',
				description: 'Example of a holiday exception on December 25th',
				value: {
					date: '2024-12-25',
					startTime: '00:00:00',
					endTime: '23:59:59',
					reason: 'Christmas Day - Office closed',
					specialistId: '123e4567-e89b-12d3-a456-426614174000',
					tenantId: '123e4567-e89b-12d3-a456-426614174001',
				},
			},
			example2: {
				summary: 'Afternoon exception',
				description: 'Example of a partial day exception',
				value: {
					date: '2024-12-20',
					startTime: '13:00:00',
					endTime: '17:00:00',
					reason: 'Team building event',
					specialistId: '123e4567-e89b-12d3-a456-426614174000',
					tenantId: '123e4567-e89b-12d3-a456-426614174001',
				},
			},
		},
	})
	@ApiCreatedResponse({
		description: 'Exception has been successfully created',
		type: Exception,
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
			'Conflict - Exception overlaps with existing exception for the same specialist and tenant on the same date',
	})
	create(@Body() createExceptionDto: CreateExceptionDto) {
		return this.exceptionService.create(createExceptionDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all exceptions' })
	@ApiOkResponse({
		description: 'List of all exceptions',
		type: Exception,
		isArray: true,
	})
	findAll() {
		return this.exceptionService.findAll();
	}

	@Get('specialist/:specialistId')
	@ApiOperation({ summary: 'Get exceptions for a specific specialist' })
	@ApiParam({
		name: 'specialistId',
		description: 'Specialist ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiOkResponse({
		description: 'List of exceptions for the specialist',
		type: Exception,
		isArray: true,
	})
	@ApiResponse({
		status: 404,
		description: 'Specialist not found',
	})
	findBySpecialist(@Param('specialistId', ParseUUIDPipe) specialistId: string) {
		return this.exceptionService.findBySpecialist(specialistId);
	}

	@Get('date-range')
	@ApiOperation({
		summary: 'Get exceptions within a date range',
		description:
			'Retrieve all exceptions that fall within the specified start and end dates',
	})
	@ApiQuery({
		name: 'startDate',
		description: 'Start date in ISO 8601 format (YYYY-MM-DD)',
		example: '2024-12-01',
		type: 'string',
		format: 'date',
		required: true,
	})
	@ApiQuery({
		name: 'endDate',
		description: 'End date in ISO 8601 format (YYYY-MM-DD)',
		example: '2024-12-31',
		type: 'string',
		format: 'date',
		required: true,
	})
	@ApiOkResponse({
		description: 'List of exceptions within the date range',
		type: Exception,
		isArray: true,
	})
	@ApiResponse({
		status: 400,
		description:
			'Bad request - Invalid date format or start date is after end date',
	})
	findByDateRange(
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string
	) {
		return this.exceptionService.findByDateRange(startDate, endDate);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get exception by ID' })
	@ApiParam({
		name: 'id',
		description: 'Exception ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiOkResponse({
		description: 'Exception found',
		type: Exception,
	})
	@ApiResponse({
		status: 404,
		description: 'Exception not found',
	})
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.exceptionService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update an exception' })
	@ApiParam({
		name: 'id',
		description: 'Exception ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiBody({
		type: UpdateExceptionDto,
		description: 'Partial exception data to update',
	})
	@ApiOkResponse({
		description: 'Exception has been successfully updated',
		type: Exception,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - Invalid input data',
	})
	@ApiResponse({
		status: 404,
		description: 'Not found - Exception, specialist, or tenant not found',
	})
	@ApiResponse({
		status: 409,
		description:
			'Conflict - Exception overlaps with existing exception for the same specialist and tenant on the same date',
	})
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateExceptionDto: UpdateExceptionDto
	) {
		return this.exceptionService.update(id, updateExceptionDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete an exception' })
	@ApiParam({
		name: 'id',
		description: 'Exception ID (UUID)',
		type: 'string',
		format: 'uuid',
	})
	@ApiNoContentResponse({
		description: 'Exception has been successfully deleted',
	})
	@ApiResponse({
		status: 404,
		description: 'Exception not found',
	})
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.exceptionService.remove(id);
	}
}
