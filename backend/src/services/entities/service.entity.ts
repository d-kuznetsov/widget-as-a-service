import { IsPositive } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Specialist } from '../../specialist/entities/specialist.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity('services')
export class Service {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 255, unique: true })
	name: string;

	@Column({ type: 'int' })
	@IsPositive({ message: 'Duration must be greater than 0' })
	duration: number; // Duration in minutes

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	@IsPositive({ message: 'Price must be greater than 0' })
	price: number;

	@ManyToOne(() => Tenant)
	@JoinColumn({ name: 'tenant_id' })
	tenant: Tenant;

	@ManyToMany(
		() => Specialist,
		(specialist) => specialist.services
	)
	@JoinTable({
		name: 'service_specialists',
		joinColumn: { name: 'service_id' },
		inverseJoinColumn: { name: 'specialist_id' },
	})
	specialists: Specialist[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
