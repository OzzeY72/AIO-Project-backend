import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { OAuthFactory } from '../factories/oauth.factory';
import { UserService } from '@/user/user.service';
import { ERROR_MESSAGES } from '@/common/error-messages';
import { TokenRequestDto } from '../dto';

@Injectable()
export class AuthorizationService {
    constructor (
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly oauthFactory: OAuthFactory,
    ) {}
    private validClients = [
        { clientId: 'your_client_id', clientSecret: 'your_client_secret' },
    ];

    async exchangeToken({ grantType, code, redirectUri, clientId, clientSecret, provider }: TokenRequestDto) {
        if (grantType !== 'authorization_code') {
            throw new BadRequestException(ERROR_MESSAGES.BAD_GRANT_TYPE);
        }
    
        //await this.ClientCredentialsVerify(clientId, clientSecret);
    
        const authProvider = this.oauthFactory.getProvider(provider);
        const openId = await authProvider.getToken(code);
    
        let user = await this.userService.FindUser({provider: provider, providerId: openId.providerId});
        if (!user) {
            user = await this.userService.CreateUser(openId, provider);
        }
    
        const accessToken = this.generateAccessToken(user.userId);
        const idToken = this.generateIdToken(user.userId, user.name, user.email);
    
        return {
            access_token: accessToken,
            id_token: idToken,
            expires_in: 3600,
            token_type: 'Bearer',
        };
    }

    ClientCredentialsVerify(clientId: string, clientSecret: string) {
        const client = this.validClients.find(
            (client) => client.clientId === clientId && client.clientSecret === clientSecret
        );

        if (!client) {
            throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CLIENT_CREDENTIALS);
        }
    }
    generateAccessToken(userId: string) {
        const payload = { sub: userId };
        return this.jwtService.sign(payload);
    }
    async validateToken(token: string): Promise<any> {
        try {
          const payload = this.jwtService.verify(token);
          return payload;
        } catch (error) {
          throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
        }
    }
    generateIdToken(userId: string, name: string, email: string) {
        const payload = { sub: userId, name: name, email: email };
        return this.jwtService.sign(payload);
    }
}
