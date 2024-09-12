import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HealthRegisterService } from './health-register.service';
import { HealthRecordService } from './health-record.service';
import { HealthStatRepository } from '../repositories/health-stat.repository';

@Injectable()
export class HealthStatsService {
  constructor(
    private readonly healthRegisterService: HealthRegisterService,
    private readonly healthRecordService: HealthRecordService,
    private readonly healthStatRepository: HealthStatRepository,
) {}

  // Запуск каждый день в 00:00
  @Cron('0 0 * * *')
  async updateUserStats() {
    const registers = await this.healthRegisterService.getAll();
    for (const register of registers) {
        const stats = await this.healthRecordService.calculateUserStats(register.user.userId, register.health.id);
        console.log(stats);
        await this.saveUserStats(register.user.id, register.health.id, stats);
    }
  }

  async saveUserStats(userId: number, healthId: number, stats: { totalDays: number, longestStreak: number }) {
    return await this.healthStatRepository.saveUserStat(userId, healthId, stats);
  }
}
