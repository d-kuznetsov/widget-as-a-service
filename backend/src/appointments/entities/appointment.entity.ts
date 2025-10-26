import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { Specialist } from '../../specialist/entities/specialist.entity';
import { User } from '../../users/user.entity';

export enum AppointmentStatus {
	BOOKED = 'booked',
	CANCELED = 'canceled',
	COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'start_time', type: 'datetime' })
	startTime: Date;

	@Column({ name: 'end_time', type: 'datetime' })
	endTime: Date;

	@Column({
		type: 'varchar',
		length: 20,
		default: AppointmentStatus.BOOKED,
	})
	status: AppointmentStatus;

	@Column({ type: 'text', nullable: true })
	comment: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Specialist)
	@JoinColumn({ name: 'specialist_id' })
	specialist: Specialist;

	@ManyToOne(() => Service)
	@JoinColumn({ name: 'service_id' })
	service: Service;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
