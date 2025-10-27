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

export enum DayOfWeek {
	MONDAY = 'monday',
	TUESDAY = 'tuesday',
	WEDNESDAY = 'wednesday',
	THURSDAY = 'thursday',
	FRIDAY = 'friday',
	SATURDAY = 'saturday',
	SUNDAY = 'sunday',
}

@Entity('working_hours')
export class WorkingHours {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'varchar',
		length: 10,
		enum: DayOfWeek,
	})
	dayOfWeek: DayOfWeek;

	@Column({ name: 'start_time', type: 'time' })
	startTime: string;

	@Column({ name: 'end_time', type: 'time' })
	endTime: string;

	@Column({ name: 'is_active', default: true })
	isActive: boolean;

	@ManyToOne(() => Specialist)
	@JoinColumn({ name: 'specialist_id' })
	specialist: Specialist;

	@ManyToOne(() => Tenant, { nullable: true })
	@JoinColumn({ name: 'tenant_id' })
	tenant: Tenant | null;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
