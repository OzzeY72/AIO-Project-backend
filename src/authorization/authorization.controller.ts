import { Controller, Get, Query, Res, Post, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthorizationService } from './services/authorization.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('oauth')
export class AuthorizationController {
    constructor(
        private readonly authorizationService: AuthorizationService,
    ) {}

    @Get('authorize')
    @ApiOperation({ summary: 'Authorize for access_code' })
    @ApiResponse({ status: 200, description: 'access_code' })
    authorize(
        @Query('response_type') responseType: string,
        @Query('client_id') clientId: string,
        @Query('redirect_uri') redirectUri: string,
        @Query('scope') scope: string,
        @Query('state') state: string,
        @Res() res: Response,
        ) {
        // Здесь ваша логика для проверки параметров и перенаправления на страницу авторизации

        // После успешной аутентификации пользователя, генерируем код авторизации и перенаправляем на redirectUri
        const authorizationCode = 'generated_authorization_code';
        res.redirect(`${redirectUri}?code=${authorizationCode}&state=${state}`);
    }

    @Post('token')
    @ApiOperation({ summary: 'Exchange access_code on tokens (access, refresh, openid)' })
    @ApiResponse({ status: 200, description: 'access, refresh, openid tokens' })
    async token(
        @Body('grant_type') grantType: string,
        @Body('code') code: string,
        @Body('redirect_uri') redirectUri: string,
        @Body('client_id') clientId: string,
        @Body('client_secret') clientSecret: string,
        @Body('provider') provider: string,
        @Res() res: Response
    ) {
        try {
            const tokens = await this.authorizationService.exchangeToken({
                grantType,
                code,
                redirectUri,
                clientId,
                clientSecret,
                provider,
            });
            res.json(tokens);
        } catch (error) {
            console.error(error.message);
            return res
                .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
        }
    }
}
