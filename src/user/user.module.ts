import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService, UserController } from '@/user';
import { User } from '@/user/entities';
import { JwtAuthModule } from '@/jwtauth.module';

@Module({
  imports: [
    JwtAuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
