export interface PgErrorWithCause {
	cause?: { code?: string; detail?: string };
}

export function isPgErrorWithCause(error: unknown): error is PgErrorWithCause {
	return typeof error === 'object' && error !== null && 'cause' in error;
}

export enum PostgresErrorCode {
	// Integrity / constraints
	UNIQUE_VIOLATION = '23505',
	FOREIGN_KEY_VIOLATION = '23503',
	NOT_NULL_VIOLATION = '23502',
	CHECK_VIOLATION = '23514',

	// Data exceptions
	INVALID_TEXT_REPRESENTATION = '22P02',
	NUMERIC_VALUE_OUT_OF_RANGE = '22003',
	STRING_DATA_RIGHT_TRUNCATION = '22001',

	// Syntax / schema
	SYNTAX_ERROR = '42601',
	UNDEFINED_COLUMN = '42703',
	UNDEFINED_TABLE = '42P01',
	UNDEFINED_PARAMETER = '42P02',

	// Auth / connection
	INVALID_AUTHORIZATION = '28000',
	INVALID_PASSWORD = '28P01',
	CONNECTION_FAILURE = '08006',

	// Transactions / concurrency
	DEADLOCK_DETECTED = '40P01',
	SERIALIZATION_FAILURE = '40001',

	// Resource / server
	TOO_MANY_CONNECTIONS = '53300',
	QUERY_CANCELED = '57014',
	ADMIN_SHUTDOWN = '57P01',
}
