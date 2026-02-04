export interface AppErrorParams {
	message: string;
	cause?: Error;
	code?: string;
	statusCode?: number;
}

export class AppError extends Error {
	public readonly cause?: Error;
	public readonly code?: string;
	public readonly statusCode: number;

	constructor(params: AppErrorParams) {
		super(params.message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);

		this.statusCode = params.statusCode ?? 500;
		this.code = params.code;
		this.cause = params.cause;
	}
}

export class DatabaseError extends AppError {
	constructor(params: Partial<AppErrorParams> = {}) {
		super({
			message: 'Database error',
			statusCode: 500,
			code: 'DATABASE_ERROR',
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
