import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationController } from './authorization.controller'
import { OAuthFactory } from './factories/oauth.factory';
import { AppleAuthService, GoogleAuthService } from './services/providers.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtAuthModule } from 'src/jwtauth.module';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    JwtAuthModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthorizationService, OAuthFactory, GoogleAuthService, AppleAuthService, JwtAuthGuard],
  controllers: [AuthorizationController],
  exports: [AuthorizationService, OAuthFactory, JwtAuthGuard],
})
export class AuthorizationModule {}
