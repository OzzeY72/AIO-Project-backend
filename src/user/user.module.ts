import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService, UserController } from '@/user';
import { User } from '@/user/entities';
import { JwtAuthModule } from '@/jwtauth.module';

@Module({
  imports: [
    forwardRef(() => JwtAuthModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
