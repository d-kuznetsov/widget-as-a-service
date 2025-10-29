import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getRoot() {
		return {
			service: 'Widget-as-a-Service API',
			version: '1.0.0',
			status: 'running',
			timestamp: new Date().toISOString(),
		};
	}

	getHealth() {
		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
		};
	}
}
