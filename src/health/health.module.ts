import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecord, Health} from '.';

@Module({
  imports: [TypeOrmModule.forFeature([Health, HealthRecord])],
  providers: [HealthService],
  controllers: [HealthController]
})
export class HealthModule {}
