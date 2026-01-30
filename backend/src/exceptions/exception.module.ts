import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Exception } from './entities/exception.entity';
import { ExceptionController } from './exception.controller';
import { ExceptionService } from './exception.service';

@Module({
	imports: [TypeOrmModule.forFeature([Exception, Specialist, Tenant])],
	controllers: [ExceptionController],
	providers: [ExceptionService],
	exports: [ExceptionService],
})
export class ExceptionModule {}
