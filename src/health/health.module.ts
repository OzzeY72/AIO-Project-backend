import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecord, Health, HealthStat} from '.';
import { HealthRecordService } from './services/health-record.service';
import { HealthRegister } from './entities/health-register.entity';
import { HealthRegisterService } from './services/health-register.service';
import { HealthRecordRepository } from './repositories/health-record.repository';
import { HealthRegisterRepository } from './repositories/health-register.repository';
import { HealthStatRepository } from './repositories/health-stat.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Health, HealthRecord, HealthStat, HealthRegister]),
    UserModule,
  ],
  providers: [
    HealthService, 
    HealthRecordService,
    HealthRegisterService, 
    HealthRecordRepository, 
    HealthRegisterRepository,
    HealthStatRepository,
  ],
  controllers: [HealthController]
})
export class HealthModule {}
