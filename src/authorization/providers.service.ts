import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface OpenID {
    email: string,
    name: string | null,
    providerId: string,
} 

export interface OAuthProvider {
    getToken(authorizationCode: string): Promise<OpenID>;
}

@Injectable()
export class GoogleAuthService implements OAuthProvider {
    constructor(
        private readonly jwtService: JwtService,
    ) {}
  async getToken(authorizationCode: string): Promise<OpenID> {
    // Логика для обмена authorizationCode на токен через Google
    const url = 'https://oauth2.googleapis.com/token';

    const params = {
        code: authorizationCode,
        client_id: process.env!.GOOGLE_CLIENTID,
        client_secret: process.env!.GOOGLE_SECRET,
        redirect_uri: process.env!.GOOGLE_REDIRECT, 
        grant_type: 'authorization_code'
      };
    
    console.log(params);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const userInfo = this.jwtService.decode(data.id_token);
    console.log(userInfo);

    return {
        email: userInfo.email,
        name: userInfo.name,
        providerId: userInfo.sub,
    };
  }
}

@Injectable()
export class AppleAuthService implements OAuthProvider {
  async getToken(authorizationCode: string): Promise<OpenID> {
    // Логика для обмена authorizationCode на токен через Apple
    return {
        email: 'test',
        name: 'test',
        providerId: 'test',
    };
  }
}