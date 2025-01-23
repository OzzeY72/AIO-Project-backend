import { JwtAuthModule } from '@/jwtauth.module';
import { User } from '@/user/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { Logger, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationOAuthController } from './controllers/authorization-oauth.controller';
import { AuthorizationController } from './controllers/authorization.controller';
import { OAuthFactory } from './factories/oauth.factory';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthorizationService } from './services/authorization.service';
import { PasswordService } from './services/password.service';
import { AppleAuthService, GoogleAuthService } from './services/providers.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => JwtAuthModule),
    forwardRef(() => TypeOrmModule.forFeature([User])),
  ],
  providers: [
    AuthorizationService, 
    OAuthFactory, 
    GoogleAuthService, 
    AppleAuthService, 
    JwtAuthGuard, 
    PasswordService, 
    {
      provide: Logger, // Регистрируем Logger как провайдер
      useValue: new Logger('AuthorizationModule'), // Указываем контекст логгера
    },
],
  controllers: [AuthorizationOAuthController, AuthorizationController],
  exports: [AuthorizationService, OAuthFactory, JwtAuthGuard],
})
export class AuthorizationModule {}
