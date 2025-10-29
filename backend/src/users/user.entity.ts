// src/entities/user.entity.ts
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

	@Column({ name: 'password_hash', select: false })
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
