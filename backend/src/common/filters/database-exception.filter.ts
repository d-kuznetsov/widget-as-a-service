import {
	BadRequestException,
	Catch,
	ConflictException,
	ExceptionFilter,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
	catch(exception: any) {
		if (exception instanceof QueryFailedError) {
			if (exception?.driverError.errno === 19) {
				throw new ConflictException(
					'DB Error: Abort due to constraint violation'
				);
			}
			throw new BadRequestException('DB Error');
		}
		throw exception;
	}
}
