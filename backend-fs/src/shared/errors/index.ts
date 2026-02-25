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

export enum RepositoryErrorCode {
	ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
	ENTITY_ALREADY_EXISTS = 'ENTITY_ALREADY_EXISTS',
	FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
	DATA_CONFLICT = 'DATA_CONFLICT',
	REPOSITORY_UNAVAILABLE = 'REPOSITORY_UNAVAILABLE',
}

export class RepositoryError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Repository error',
			code: 'REPOSITORY_ERROR',
			...params,
		});
	}
	static createEntityNotFound(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Entity not found',
			code: RepositoryErrorCode.ENTITY_NOT_FOUND,
			...params,
		});
	}
	static createEntityAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Entity already exists',
			code: RepositoryErrorCode.ENTITY_ALREADY_EXISTS,
			...params,
		});
	}
	static createForeignKeyViolation(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Foreign key violation',
			code: RepositoryErrorCode.FOREIGN_KEY_VIOLATION,
			...params,
		});
	}
	static createDataConflict(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Data conflict',
			code: RepositoryErrorCode.DATA_CONFLICT,
			...params,
		});
	}
	static createRepositoryUnavailable(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Repository unavailable',
			code: RepositoryErrorCode.REPOSITORY_UNAVAILABLE,
			...params,
		});
	}
}

export enum ServiceErrorCode {
	USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
	AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
	SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
	REVOKED_TOKEN_REUSE = 'REVOKED_TOKEN_REUSE',
	TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
}

export class ServiceError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Service error',
			code: 'SERVICE_ERROR',
			...params,
		});
	}

	static createUserAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'User already exists',
			code: ServiceErrorCode.USER_ALREADY_EXISTS,
			...params,
		});
	}
	static createUserNotFound(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'User not found',
			code: ServiceErrorCode.USER_NOT_FOUND,
			...params,
		});
	}
	static createInvalidCredentials(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'Invalid credentials',
			code: ServiceErrorCode.INVALID_CREDENTIALS,
			...params,
		});
	}
	static createAuthenticationError(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'Authentication error',
			code: ServiceErrorCode.AUTHENTICATION_ERROR,
			...params,
		});
	}

	static createRevokedTokenReuse(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'Revoked token reuse',
			code: ServiceErrorCode.REVOKED_TOKEN_REUSE,
			...params,
		});
	}

	static createTenantNotFound(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'Tenant not found',
			code: ServiceErrorCode.TENANT_NOT_FOUND,
			...params,
		});
	}
}
