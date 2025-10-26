import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
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

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
