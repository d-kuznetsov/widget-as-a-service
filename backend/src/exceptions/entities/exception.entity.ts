import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Specialist } from '../../specialist/entities/specialist.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity('exceptions')
export class Exception {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'date', type: 'date' })
	date: Date;

	@Column({ name: 'start_time', type: 'time' })
	startTime: string;

	@Column({ name: 'end_time', type: 'time' })
	endTime: string;

	@Column({ type: 'text' })
	reason: string;

	@ManyToOne(() => Specialist, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'specialist_id' })
	specialist: Specialist;

	@ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'tenant_id' })
	tenant: Tenant;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
