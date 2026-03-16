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
	USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
	AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
	SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
	REVOKED_TOKEN_REUSE = 'REVOKED_TOKEN_REUSE',
	TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
	ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
}

export class DomainError extends AppError {
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
	static roleNotFound(params: Partial<AppErrorParams> = {}) {
		return new DomainError({
			message: 'Role not found',
			code: DomainErrorCode.ROLE_NOT_FOUND,
			...params,
		});
	}
}
