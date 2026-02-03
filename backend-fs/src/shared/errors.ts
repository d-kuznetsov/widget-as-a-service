export class AppError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number = 500,
		public readonly code?: string
	) {
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class DatabaseError extends AppError {
	constructor(message: string = 'Database error') {
		super(message, 500, 'DATABASE_ERROR');
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Conflict') {
		super(message, 409, 'CONFLICT');
	}
}
