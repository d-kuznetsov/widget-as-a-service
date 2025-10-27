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

	@Column({ length: 255 })
	name: string;

	@Column({ type: 'int' })
	duration: number; // Duration in minutes

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	price: number;

	@ManyToOne(() => Tenant, { nullable: true })
	@JoinColumn({ name: 'tenant_id' })
	tenant: Tenant | null;

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
