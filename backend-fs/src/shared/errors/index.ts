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
	}
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
}

// EntityNotFound EntityAlreadyExists ForeignKeyViolation DataConflict RepositoryUnavailable
export class EntityNotFoundError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Entity not found',
			statusCode: 404,
			code: 'ENTITY_NOT_FOUND',
			...params,
		});
	}
}

export class EntityAlreadyExistsError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Entity already exists',
			statusCode: 409,
			code: 'ENTITY_ALREADY_EXISTS',
			...params,
		});
	}
}

export class ForeignKeyViolationError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Foreign key violation',
			statusCode: 409,
			code: 'FOREIGN_KEY_VIOLATION',
			...params,
		});
	}
}

export class ConflictError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Conflict',
			statusCode: 409,
			code: 'CONFLICT',
			...params,
		});
	}
}

export class DataConflictError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Data conflict',
			statusCode: 409,
			code: 'DATA_CONFLICT',
			...params,
		});
	}
}

export class RepositoryUnavailableError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Repository unavailable',
			statusCode: 503,
			code: 'REPOSITORY_UNAVAILABLE',
			...params,
		});
	}
}

export class NotFoundError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Not found',
			statusCode: 404,
			code: 'NOT_FOUND',
			...params,
		});
	}
}
