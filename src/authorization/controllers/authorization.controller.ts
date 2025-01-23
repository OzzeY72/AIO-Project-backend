import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthorizationService } from '../services/authorization.service';

@ApiTags('Authorization OAuth')
@Controller('authorize')
export class AuthorizationController {
    constructor(
        private readonly authorizationService: AuthorizationService,
    ) {}

    @Post('signup')
    @ApiOperation({ summary: 'Signup' })
    @ApiResponse({ status: 200, description: '' })
    async signup(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.authorizationService.signUpWithPassword({email, password});
            return res.status(200).json(result);
        } catch (error) {
            console.error(error.message);
            return res
                .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: '' })
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.authorizationService.loginWithPassword({email, password});
            return res.status(200).json(result);
        } catch (error) {
            console.error(error.message);
            return res
                .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
        }
    }
}
