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

	@ManyToOne(() => Specialist)
	@JoinColumn({ name: 'specialist_id' })
	specialist: Specialist;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
