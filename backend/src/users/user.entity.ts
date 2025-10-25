// src/entities/user.entity.ts
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true, length: 50 })
	username: string;

	@Column({ unique: true, length: 100 })
	email: string;

	@Column({ name: 'password_hash' })
	passwordHash: string;

	@Column({ name: 'is_active', default: true })
	isActive: boolean;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@ManyToMany(() => Role)
	@JoinTable({
		name: 'user_roles',
		joinColumn: { name: 'user_id' },
		inverseJoinColumn: { name: 'role_id' },
	})
	roles: Role[];
}
