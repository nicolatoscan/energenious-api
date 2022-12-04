import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        const token = await this.authService.getToken(req.user);
        return { ...req.user, token };
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
