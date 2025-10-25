import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';
import { SeederService } from './seeder.service';

@Module({
	imports: [TypeOrmModule.forFeature([Role, User])],
	providers: [SeederService],
	exports: [SeederService],
})
export class DatabaseModule {}
