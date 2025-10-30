import {
	BadRequestException,
	Catch,
	ConflictException,
	ExceptionFilter,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
	catch(exception: QueryFailedError) {
		// @ts-expect-error - driverError is not typed
		if (exception?.driverError?.errno === 19) {
			throw new ConflictException(
				'DB Error: Abort due to constraint violation'
			);
		}
		throw new BadRequestException('DB Error');
	}
}
