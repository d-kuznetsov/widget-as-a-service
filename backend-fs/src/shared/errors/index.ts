export interface AppErrorParams {
	message: string;
	cause?: Error;
	code?: string;
}

export class AppError extends Error {
	public readonly cause?: Error;
	public readonly code?: string;

	constructor(params: AppErrorParams) {
		super(params.message);

		this.name = this.constructor.name;
		this.code = params.code;
		this.cause = params.cause;

		Error.captureStackTrace?.(this, new.target);
	}
}

export const DATABASE_ERROR_CODE = 'DATABASE_ERROR';

export class DataBaseError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Database error',
			code: DATABASE_ERROR_CODE,
			...params,
		});
	}
}

export enum DomainErrorCode {
	BAD_REQUEST = 'BAD_REQUEST',
	USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
	AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
	SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
	REVOKED_TOKEN_REUSE = 'REVOKED_TOKEN_REUSE',
	TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
	TENANT_SLUG_ALREADY_EXISTS = 'TENANT_SLUG_ALREADY_EXISTS',
	ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
	INVITE_ALREADY_EXISTS = 'INVITE_ALREADY_EXISTS',
	INVITE_NOT_FOUND = 'INVITE_NOT_FOUND',
	INVITE_EXPIRED = 'INVITE_EXPIRED',
	INVITE_ALREADY_USED = 'INVITE_ALREADY_USED',
	SPECIALIST_NAME_ALREADY_EXISTS = 'SPECIALIST_NAME_ALREADY_EXISTS',
	SPECIALIST_USER_ALREADY_LINKED = 'SPECIALIST_USER_ALREADY_LINKED',
	SPECIALIST_NOT_FOUND = 'SPECIALIST_NOT_FOUND',
	SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
	WORKING_HOURS_NOT_FOUND = 'WORKING_HOURS_NOT_FOUND',
	EXCEPTION_NOT_FOUND = 'EXCEPTION_NOT_FOUND',
	EXCEPTION_OVERLAPS_EXISTING = 'EXCEPTION_OVERLAPS_EXISTING',
	APPOINTMENT_OVERLAPS_EXISTING = 'APPOINTMENT_OVERLAPS_EXISTING',
}

export class DomainError extends AppError {
	static badRequest(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Bad request',
			code: DomainErrorCode.BAD_REQUEST,
			...params,
		});
	}
	static userAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'User already exists',
			code: DomainErrorCode.USER_ALREADY_EXISTS,
			...params,
		});
	}
	static userNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'User not found',
			code: DomainErrorCode.USER_NOT_FOUND,
			...params,
		});
	}
	static invalidCredentials(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Invalid credentials',
			code: DomainErrorCode.INVALID_CREDENTIALS,
			...params,
		});
	}
	static authenticationError(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Authentication error',
			code: DomainErrorCode.AUTHENTICATION_ERROR,
			...params,
		});
	}
	static revokedTokenReuse(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Revoked token reuse',
			code: DomainErrorCode.REVOKED_TOKEN_REUSE,
			...params,
		});
	}
	static tenantNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Tenant not found',
			code: DomainErrorCode.TENANT_NOT_FOUND,
			...params,
		});
	}
	static tenantSlugAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Tenant slug already exists',
			code: DomainErrorCode.TENANT_SLUG_ALREADY_EXISTS,
			...params,
		});
	}
	static roleNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Role not found',
			code: DomainErrorCode.ROLE_NOT_FOUND,
			...params,
		});
	}
	static inviteNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Invite not found',
			code: DomainErrorCode.INVITE_NOT_FOUND,
			...params,
		});
	}
	static inviteExpired(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Invite expired',
			code: DomainErrorCode.INVITE_EXPIRED,
			...params,
		});
	}
	static inviteAlreadyUsed(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Invite already used',
			code: DomainErrorCode.INVITE_ALREADY_USED,
			...params,
		});
	}
	static inviteAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Invite already exists',
			code: DomainErrorCode.INVITE_ALREADY_EXISTS,
			...params,
		});
	}
	static specialistNameAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Specialist name already exists',
			code: DomainErrorCode.SPECIALIST_NAME_ALREADY_EXISTS,
			...params,
		});
	}
	static specialistUserAlreadyLinked(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'User is already linked to a specialist in this tenant',
			code: DomainErrorCode.SPECIALIST_USER_ALREADY_LINKED,
			...params,
		});
	}
	static specialistNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Specialist not found',
			code: DomainErrorCode.SPECIALIST_NOT_FOUND,
			...params,
		});
	}
	static serviceNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Service not found',
			code: DomainErrorCode.SERVICE_NOT_FOUND,
			...params,
		});
	}
	static workingHoursNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Working hours not found',
			code: DomainErrorCode.WORKING_HOURS_NOT_FOUND,
			...params,
		});
	}
	static exceptionNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Schedule exception not found',
			code: DomainErrorCode.EXCEPTION_NOT_FOUND,
			...params,
		});
	}
	static exceptionOverlapsExisting(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message:
				'This time range overlaps an existing schedule exception for this specialist on this date',
			code: DomainErrorCode.EXCEPTION_OVERLAPS_EXISTING,
			...params,
		});
	}
	static appointmentOverlapsExisting(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message:
				'This time range overlaps an existing appointment for this specialist on this date',
			code: DomainErrorCode.APPOINTMENT_OVERLAPS_EXISTING,
			...params,
		});
	}
}
