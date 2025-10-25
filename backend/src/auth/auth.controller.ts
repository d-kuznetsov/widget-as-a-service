import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RequireRoles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	signIn(@Body() signInDto: Record<string, any>) {
		return this.authService.signIn(signInDto.username, signInDto.password);
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	// biome-ignore lint/suspicious/noExplicitAny: <later>
	getProfile(@Request() req: any) {
		return req.user;
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Get('profile-admin')
	@RequireRoles('admin')
	// biome-ignore lint/suspicious/noExplicitAny: <later>
	getAdminProfile(@Request() req: any) {
		return req.user;
	}
}
