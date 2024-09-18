import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecord, Health, HealthStat, HealthRecordService, HealthRegister, HealthStatsService, HealthService } from '.';
import { HealthRegisterService, HealthRecordRepository, HealthRegisterRepository, HealthStatRepository } from '.';
import { UserModule } from 'src/user/user.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { JwtAuthModule } from 'src/jwtauth.module';
import { UserService } from '@/user/user.service';
import { User } from '@/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Health, HealthRecord, HealthStat, HealthRegister, User]),
    AuthorizationModule,
    JwtAuthModule,
  ],
  providers: [
    HealthService, 
    HealthRecordService,
    HealthRegisterService, 
    HealthRecordRepository, 
    HealthRegisterRepository,
    HealthStatRepository,
    HealthStatsService,
  ],
  controllers: [HealthController]
})
export class HealthModule {}
