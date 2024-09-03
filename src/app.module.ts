import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    AuthorizationModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'test', 
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
  ],
  controllers: [AppController, AuthorizationController],
  providers: [AppService],
})
export class AppModule {}
