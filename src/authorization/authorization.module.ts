import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthorizationService} from './authorization.service';
import { AuthorizationController } from './authorization.controller'
import { JwtModule } from '@nestjs/jwt';
import { OAuthFactory } from './oauth.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppleAuthService, GoogleAuthService } from './providers.service';
import { JwtAuthGuard } from './jwt-auth.guard'

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthorizationService, OAuthFactory, GoogleAuthService, AppleAuthService, JwtAuthGuard],
  controllers: [AuthorizationController],
  exports: [AuthorizationService, OAuthFactory, JwtAuthGuard],
})
export class AuthorizationModule {}
