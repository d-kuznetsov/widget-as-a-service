export interface AppErrorParams {
	message: string;
	cause?: Error;
	code?: string;
	statusCode?: number;
}

export class AppError extends Error {
	public readonly cause?: Error;
	public readonly code?: string;
	public readonly statusCode?: number;

	constructor(params: AppErrorParams) {
		super(params.message);

		this.name = this.constructor.name;
		this.statusCode = params.statusCode ?? 500;
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
			statusCode: 500,
			code: 'REPOSITORY_ERROR',
			...params,
		});
	}
	static createEntityNotFound(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Entity not found',
			statusCode: 404,
			code: RepositoryErrorCode.ENTITY_NOT_FOUND,
			...params,
		});
	}
	static createEntityAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Entity already exists',
			statusCode: 409,
			code: RepositoryErrorCode.ENTITY_ALREADY_EXISTS,
			...params,
		});
	}
	static createForeignKeyViolation(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Foreign key violation',
			statusCode: 409,
			code: RepositoryErrorCode.FOREIGN_KEY_VIOLATION,
			...params,
		});
	}
	static createDataConflict(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Data conflict',
			statusCode: 409,
			code: RepositoryErrorCode.DATA_CONFLICT,
			...params,
		});
	}
	static createRepositoryUnavailable(params: Partial<AppErrorParams> = {}) {
		return new RepositoryError({
			message: 'Repository unavailable',
			statusCode: 503,
			code: RepositoryErrorCode.REPOSITORY_UNAVAILABLE,
			...params,
		});
	}
}

export enum ServiceErrorCode {
	USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export class ServiceError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Service error',
			statusCode: 500,
			code: 'SERVICE_ERROR',
			...params,
		});
	}

	static createUserAlreadyExists(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'User already exists',
			statusCode: 409,
			code: ServiceErrorCode.USER_ALREADY_EXISTS,
			...params,
		});
	}
	static createUserNotFound(params: Partial<AppErrorParams> = {}) {
		return new ServiceError({
			message: 'User not found',
			statusCode: 404,
			code: ServiceErrorCode.USER_NOT_FOUND,
			...params,
		});
	}
}
