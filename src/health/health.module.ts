import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecord, Health, HealthStat,  HealthRegister } from '@/health/entities';
import { HealthRecordService, HealthStatsService, HealthRegisterService } from '@/health/services';
import { HealthRecordRepository, HealthRegisterRepository, HealthStatRepository } from '@/health/repositories';
import { HealthService, HealthController } from '@/health';
import { AuthorizationModule } from '@/authorization/authorization.module';
import { JwtAuthModule } from '@/jwtauth.module';
import { User } from '@/user/entities';

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
