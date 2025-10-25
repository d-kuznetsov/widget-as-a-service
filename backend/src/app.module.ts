import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { Role } from './roles/role.entity';
import { RolesModule } from './roles/roles.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

const typeOrmModuleOptions: TypeOrmModuleOptions = {
	type: 'sqlite',
	database: 'db.sqlite',
	entities: [Role, User],
	synchronize: true,
	logging: true,
};

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => typeOrmModuleOptions,
		}),
		DatabaseModule,
		AuthModule,
		UsersModule,
		RolesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
