import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationController } from './authorization.controller'
import { OAuthFactory } from './factories/oauth.factory';
import { AppleAuthService, GoogleAuthService } from './services/providers.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtAuthModule } from '@/jwtauth.module';
import { UserModule } from '@/user/user.module';


@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => JwtAuthModule),
    forwardRef(() => TypeOrmModule.forFeature([User])),
  ],
  providers: [AuthorizationService, OAuthFactory, GoogleAuthService, AppleAuthService, JwtAuthGuard],
  controllers: [AuthorizationController],
  exports: [AuthorizationService, OAuthFactory, JwtAuthGuard],
})
export class AuthorizationModule {}
