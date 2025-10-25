import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';

async function seed() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const seederService = app.get(SeederService);
	console.log('Seeding database...');

	try {
		await seederService.seed();
		console.log('✅ Database seeded successfully!');
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	} finally {
		await app.close();
	}
}

async function clear() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const seederService = app.get(SeederService);

	try {
		await seederService.clearDatabase();
		console.log('✅ Database cleared successfully!');
	} catch (error) {
		console.error('❌ Clearing failed:', error);
		process.exit(1);
	} finally {
		await app.close();
	}
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
	case 'seed':
		seed();
		break;
	case 'clear':
		clear();
		break;
	case 'reset':
		clear().then(() => seed());
		break;
	default:
		console.log('Usage: npm run seed [seed|clear|reset]');
		console.log('  seed  - Seed the database with initial data');
		console.log('  clear - Clear all data from the database');
		console.log('  reset - Clear and then seed the database');
		process.exit(1);
}
