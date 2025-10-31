import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { User } from '../../users/user.entity';

@Entity('specialists')
export class Specialist {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 255, unique: true })
	name: string;

	@Column({ type: 'text' })
	description: string;

	@OneToOne(() => User, { nullable: true })
	@JoinColumn()
	user: User | null;

	@ManyToOne(() => Tenant, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'tenant_id' })
	tenant: Tenant;

	@ManyToMany(
		() => Service,
		(service) => service.specialists,
		{ onDelete: 'CASCADE' }
	)
	services: Service[];

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
