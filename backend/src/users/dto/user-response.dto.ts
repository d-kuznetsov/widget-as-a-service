import { ApiProperty } from '@nestjs/swagger';
import { RoleName } from '../../roles/role.constants';

export class UserResponseDto {
	@ApiProperty({
		description: 'Unique identifier for the user',
		format: 'uuid',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id: string;

	@ApiProperty({
		description: 'Username for the user',
		example: 'john_doe',
	})
	username: string;

	@ApiProperty({
		description: 'Email address of the user',
		format: 'email',
		example: 'john.doe@example.com',
	})
	email: string;

	@ApiProperty({
		description: 'Whether the user account is active',
		example: true,
	})
	isActive: boolean;

	@ApiProperty({
		description: 'Array of roles assigned to the user',
		enum: ['super_admin', 'tenant_admin', 'specialist', 'client'],
		isArray: true,
		example: ['client', 'specialist'],
	})
	roles: RoleName[];

	@ApiProperty({
		description: 'Date when the user was created',
		format: 'date-time',
		example: '2024-01-15T10:30:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Date when the user was last updated',
		format: 'date-time',
		example: '2024-01-15T10:30:00.000Z',
	})
	updatedAt: Date;
}
