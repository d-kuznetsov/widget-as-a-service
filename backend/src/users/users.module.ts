import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, Role])],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
