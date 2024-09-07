import { Controller, Get, Query, Res, Post, Body, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthorizationService } from './authorization.service';
import { OAuthFactory } from './oauth.factory';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('oauth')
export class AuthorizationController {
    constructor(
        private readonly authorizationService: AuthorizationService,
        private readonly userService: UserService,
        private readonly oauthFactory: OAuthFactory,
    ) {}

    @Get('authorize')
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
            if(grantType !== 'authorization_code') return res.status(HttpStatus.BAD_REQUEST).json({ error: "Unsupported grant_type" });
            this.authorizationService.ClientCredentialsVerify(clientId, clientSecret);

            //Request OpenId from Provider
            const authProvider = this.oauthFactory.getProvider(provider);
            const openId = await authProvider.getToken(code);

            //Create new User ?
            let user = await this.userService.FindUser({provider: provider, providerId: openId.providerId});
            if ( !user ) user = await this.userService.CreateUser(openId, provider);
            
            //Issue new token
            const accessToken = this.authorizationService.generateAccessToken(user.userId);
            const idToken = this.authorizationService.generateIdToken(user.userId, user.name, user.email);

            console.log(accessToken);

            res.json({
                access_token: accessToken,
                id_token: idToken,
                expires_in: 3600,
                token_type: 'Bearer',
            });

        } catch (error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
