// src/auth/roles.guard.ts
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser } from './interfaces/authenticated-request.interface';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);

		if (!requiredRoles) {
			return true; // No roles required, allow access
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user as AuthenticatedUser;

		if (!user) {
			throw new ForbiddenException('User not authenticated');
		}

		const userRoles = user.roles || [];
		const hasRole = requiredRoles.some((role) => userRoles.includes(role));

		if (!hasRole) {
			throw new ForbiddenException(
				`Access denied. Required roles: ${requiredRoles.join(', ')}`
			);
		}

		return true;
	}
}
