import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller'
import { JwtModule } from '@nestjs/jwt';
import { OAuthFactory } from './oauth.factory';
import { AppleAuthService, GoogleAuthService } from './providers.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'test', 
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
  ],
  providers: [AuthorizationService, OAuthFactory, GoogleAuthService, AppleAuthService],
  controllers: [AuthorizationController],
  exports: [AuthorizationService, OAuthFactory],
})
export class AuthorizationModule {}
