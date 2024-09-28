import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from '@/common/error-messages';

@Injectable()
export class AuthorizationService {
    constructor (
        private readonly jwtService: JwtService,
    ) {}
    private validClients = [
        { clientId: 'your_client_id', clientSecret: 'your_client_secret' },
    ];

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
