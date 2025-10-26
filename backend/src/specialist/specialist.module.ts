import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Specialist } from './entities/specialist.entity';
import { SpecialistController } from './specialist.controller';
import { SpecialistService } from './specialist.service';

@Module({
	imports: [TypeOrmModule.forFeature([Specialist, User])],
	controllers: [SpecialistController],
	providers: [SpecialistService],
	exports: [SpecialistService],
})
export class SpecialistModule {}
