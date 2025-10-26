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

	@ManyToOne(() => Specialist, { nullable: false })
	@JoinColumn({ name: 'specialist_id' })
	specialist: Specialist;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
