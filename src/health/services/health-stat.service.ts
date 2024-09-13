import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HealthRegisterService, HealthRecordService, HealthStatRepository, HealthStat, HealthStatDto } from '..';

@Injectable()
export class HealthStatsService {
  constructor(
    private readonly healthRegisterService: HealthRegisterService,
    private readonly healthRecordService: HealthRecordService,
    private readonly healthStatRepository: HealthStatRepository,
) {}

  async getUserStat(userId: string, healthId) {
    const stat = await this.healthStatRepository.findUserStat(userId, healthId);
    return this.toHealthStatDto(stat);
  } 

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

  private toHealthStatDto(healthStat: HealthStat): HealthStatDto {
    return {
      totalDays: healthStat.totalDays,
      longestStreak: healthStat.longestStreak
    };
}
}
