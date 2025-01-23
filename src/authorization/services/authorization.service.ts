import { ERROR_MESSAGES } from '@/common/error-messages';
import { validateEmail } from '@/common/validators';
import { validatePassword } from '@/common/validators/password-validators';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto, SignupRequestDto, TokenRequestDto } from '../dto';
import { OAuthFactory } from '../factories/oauth.factory';
import { PasswordService } from './password.service';

@Injectable()
export class AuthorizationService {
    constructor (
        private readonly logger: Logger,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly oauthFactory: OAuthFactory,
        private readonly passwordService: PasswordService,
    ) {}
    private validClients = [
        { clientId: 'your_client_id', clientSecret: 'your_client_secret' },
    ];

    validateSignUp({email, password}: SignupRequestDto){
        if(!validateEmail(email)) return false;
        if(!validatePassword(password)) return false;
        return true;
    }

    async signUpWithPassword({email, password}: SignupRequestDto) {
        if(!this.validateSignUp({email, password})){
            throw new BadRequestException(ERROR_MESSAGES.INVALID_CLIENT_CREDENTIALS);
        }
        let user = await this.userService.FindUser({email});
        if(!user) {
            user = await this.userService.CreateUser(
                email,
                '', 
                '',
                '',
                '',
                await this.passwordService.hashPassword(password)
            );
            this.logger.log(`User with email: ${user.email} and id: ${user.id} created successfully`);
        } else {
            this.logger.warn(`User with email: ${email} already exist!`);
            throw new BadRequestException(ERROR_MESSAGES.USER_EXIST);
        }

        return {success: true, message: "User created successfully!"}
    }

    async loginWithPassword({email, password}: LoginRequestDto) {
        if(email == "" || password == "") return;
        let user = await this.userService.FindUser({email});

        if(!user) {
            this.logger.warn(ERROR_MESSAGES.USER_NOT_FOUND);
            throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        if(this.passwordService.comparePassword(password, user.password)) {
            const accessToken = this.generateAccessToken(user.userId);
            const idToken = this.generateIdToken(user.userId, user.name, user.email);

            this.logger.log(`User ${email} logged in succesfully with token: ${accessToken}`);

            return {
                access_token: accessToken,
                id_token: idToken,
                expires_in: 3600,
                token_type: 'Bearer',
            };
        }
        else {
            throw new BadRequestException(ERROR_MESSAGES.INVALID_AUTH);
        }

    }

    async exchangeToken({ grantType, code, redirectUri, clientId, clientSecret, provider }: TokenRequestDto) {
        if (grantType !== 'authorization_code') {
            throw new BadRequestException(ERROR_MESSAGES.BAD_GRANT_TYPE);
        }
    
        //await this.ClientCredentialsVerify(clientId, clientSecret);
    
        const authProvider = this.oauthFactory.getProvider(provider);
        const openId = await authProvider.getToken(code);
    
        let user = await this.userService.FindUser({provider: provider, providerId: openId.providerId});
        if (!user) {
            user = await this.userService.CreateUser(
                openId.email,
                openId.name, 
                provider,
                openId.providerId,
                openId.userLogo,
                ''
            );
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
