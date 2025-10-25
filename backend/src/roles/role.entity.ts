// src/entities/role.entity.ts
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true, length: 50 })
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}
