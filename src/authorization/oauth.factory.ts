import { Injectable } from '@nestjs/common';
import { OAuthProvider, GoogleAuthService, AppleAuthService } from './providers.service';  

@Injectable()
export class OAuthFactory {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly appleAuthService: AppleAuthService,
  ) {}

  getProvider(provider: string): OAuthProvider {
    switch (provider) {
      case 'google':
        return this.googleAuthService;
      case 'apple':
        return this.appleAuthService;
      default:
        throw new Error('Unsupported provider');
    }
  }
}