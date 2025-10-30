// src/entities/user.entity.ts

import { Exclude } from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { RoleName } from '../roles/role.constants';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true, length: 50 })
	username: string;

	@Column({ unique: true, length: 100 })
	email: string;

	@Exclude()
	@Column({ name: 'password_hash' })
	passwordHash: string;

	@Column({ name: 'is_active', default: true })
	isActive: boolean;

	@Column({ type: 'simple-array', default: '' })
	roles: RoleName[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
