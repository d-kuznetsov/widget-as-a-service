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
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
	constructor(private readonly tenantService: TenantService) {}

	@Post()
	create(@Body() createTenantDto: CreateTenantDto) {
		return this.tenantService.create(createTenantDto);
	}

	@Get()
	findAll() {
		return this.tenantService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.tenantService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateTenantDto: UpdateTenantDto
	) {
		return this.tenantService.update(id, updateTenantDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.tenantService.remove(id);
	}
}
