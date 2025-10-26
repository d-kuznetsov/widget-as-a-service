import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { User } from '../../users/user.entity';

@Entity('specialists')
export class Specialist {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 255 })
	name: string;

	@Column({ type: 'text' })
	description: string;

	@OneToOne(() => User, { nullable: true })
	@JoinColumn()
	user: User | null;

	@ManyToMany(
		() => Service,
		(service) => service.specialists
	)
	services: Service[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
