import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
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
