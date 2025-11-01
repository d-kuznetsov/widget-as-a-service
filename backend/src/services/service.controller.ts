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
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceService } from './service.service';

@Controller('services')
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@Post()
	create(@Body() createServiceDto: CreateServiceDto) {
		return this.serviceService.create(createServiceDto);
	}

	@Get()
	findAll() {
		return this.serviceService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.serviceService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateServiceDto: UpdateServiceDto
	) {
		return this.serviceService.update(id, updateServiceDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.serviceService.remove(id);
	}
}
