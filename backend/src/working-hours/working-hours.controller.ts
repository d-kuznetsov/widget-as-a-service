import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';
import { WorkingHoursService } from './working-hours.service';

@Controller('working-hours')
export class WorkingHoursController {
	constructor(private readonly workingHoursService: WorkingHoursService) {}

	@Post()
	create(@Body() createWorkingHoursDto: CreateWorkingHoursDto) {
		return this.workingHoursService.create(createWorkingHoursDto);
	}

	@Get()
	findAll() {
		return this.workingHoursService.findAll();
	}

	@Get('specialist/:specialistId')
	findBySpecialist(@Param('specialistId', ParseUUIDPipe) specialistId: string) {
		return this.workingHoursService.findBySpecialist(specialistId);
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.workingHoursService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateWorkingHoursDto: UpdateWorkingHoursDto
	) {
		return this.workingHoursService.update(id, updateWorkingHoursDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.workingHoursService.remove(id);
	}
}
