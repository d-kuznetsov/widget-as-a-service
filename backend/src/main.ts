import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter()
	);

	// Enable global class serializer
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	// Enable global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Strip properties that do not have any decorators
			forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
			transform: true, // Automatically transform payloads to DTO instances
			transformOptions: {
				enableImplicitConversion: true, // Convert types automatically
			},
		})
	);

	// Global exception filter
	app.useGlobalFilters(new DatabaseExceptionFilter());

	// Swagger configuration
	const config = new DocumentBuilder()
		.setTitle('Widget as a Service API')
		.setDescription('API documentation for the Widget as a Service application')
		.setVersion('1.0')
		.addTag('users', 'User management endpoints')
		.addTag('working-hours', 'Working hours management endpoints')
		.addTag('exceptions', 'Exception management endpoints')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
