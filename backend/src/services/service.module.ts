import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Service } from './entities/service.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
	imports: [TypeOrmModule.forFeature([Service, Specialist])],
	controllers: [ServiceController],
	providers: [ServiceService],
	exports: [ServiceService],
})
export class ServiceModule {}
