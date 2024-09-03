import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorizationCode } from './entities/authorizationcode.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { emit } from 'process';
import { v4 as uuidv4 } from 'uuid';
import { OpenID } from './providers.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthorizationService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
            throw new UnauthorizedException('Invalid client credentials');
        }
    }
    generateAccessToken(userId: string) {
        const payload = { sub: userId, eat: new Date().getSeconds() + 3600 };
        return this.jwtService.sign(payload);
    }
    generateIdToken(userId: string, name: string, email: string) {
        const payload = { sub: userId, name: name, email: email };
        return this.jwtService.sign(payload);
    }
    async FindUser(provider: string,providerId: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ provider: provider, providerId: providerId });
    }
    async CreateUser( openId: OpenID, provider: string) {
        const user_db = this.userRepository.create({
            email: openId.email,
            name: openId.name,
            provider: provider,
            providerId: openId.providerId,
            userId: uuidv4(),
        });
        return this.userRepository.save(user_db);
    }
}
