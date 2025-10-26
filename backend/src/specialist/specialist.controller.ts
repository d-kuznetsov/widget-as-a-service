import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { SpecialistService } from './specialist.service';

@Controller('specialists')
@UseGuards(AuthGuard)
export class SpecialistController {
	constructor(private readonly specialistService: SpecialistService) {}

	@Post()
	create(@Body() createSpecialistDto: CreateSpecialistDto) {
		return this.specialistService.create(createSpecialistDto);
	}

	@Get()
	findAll() {
		return this.specialistService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.specialistService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateSpecialistDto: UpdateSpecialistDto
	) {
		return this.specialistService.update(id, updateSpecialistDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.specialistService.remove(id);
	}

	@Put(':id/assign-user')
	assignUser(@Param('id') id: string, @Body() body: { userId: string }) {
		return this.specialistService.assignUser(id, body.userId);
	}

	@Put(':id/unassign-user')
	unassignUser(@Param('id') id: string) {
		return this.specialistService.unassignUser(id);
	}
}
