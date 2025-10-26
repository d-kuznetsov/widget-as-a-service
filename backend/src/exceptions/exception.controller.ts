import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CreateExceptionDto } from './dto/create-exception.dto';
import { UpdateExceptionDto } from './dto/update-exception.dto';
import { ExceptionService } from './exception.service';

@Controller('exceptions')
export class ExceptionController {
	constructor(private readonly exceptionService: ExceptionService) {}

	@Post()
	create(@Body() createExceptionDto: CreateExceptionDto) {
		return this.exceptionService.create(createExceptionDto);
	}

	@Get()
	findAll() {
		return this.exceptionService.findAll();
	}

	@Get('specialist/:specialistId')
	findBySpecialist(@Param('specialistId', ParseUUIDPipe) specialistId: string) {
		return this.exceptionService.findBySpecialist(specialistId);
	}

	@Get('date-range')
	findByDateRange(
		@Query('startDate') startDate: string,
		@Query('endDate') endDate: string
	) {
		return this.exceptionService.findByDateRange(startDate, endDate);
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.exceptionService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateExceptionDto: UpdateExceptionDto
	) {
		return this.exceptionService.update(id, updateExceptionDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.exceptionService.remove(id);
	}
}
