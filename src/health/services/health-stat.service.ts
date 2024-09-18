import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HealthRegisterService, HealthRecordService, HealthStatRepository, HealthStat, HealthStatDto } from '..';
import { calculateDaysBetween } from '@/common/utils';
import { CompleteStatDto } from '../dto/health-stat.dto';

@Injectable()
export class HealthStatsService {
  constructor(
    private readonly healthRegisterService: HealthRegisterService,
    private readonly healthRecordService: HealthRecordService,
    private readonly healthStatRepository: HealthStatRepository,
) {}

  async getUserStat(userId: string, healthId: number) {
    const stat = await this.healthStatRepository.findUserStat(userId, healthId);
    return this.toHealthStatDto(stat);
  }
  
  async getCompleteUserStat(userId: string, healthId: number): Promise<CompleteStatDto> {
    const stat = await this.getUserStat(userId, healthId);
    const lastStreak = await this.healthRecordService.findLast(userId, healthId);
    const { countPerDay } = await this.healthRegisterService.getUserRegisterData(userId, healthId);
    const badThingCount = countPerDay * stat.totalDays;

    const completeStatistic = {
      totalDays: stat.totalDays,
      longestStreak: stat.longestStreak,
      lastBadDay: lastStreak.streakBegin,
      lastStreakDays: calculateDaysBetween(lastStreak.streakBegin, lastStreak.streakEnd),
      badThingCount: badThingCount,
      moneySaved: badThingCount * 0.25,
    }
    return completeStatistic;
  }

  // Запуск каждый день в 00:00
  @Cron('0 0 * * *')
  async updateUserStats() {
    const registers = await this.healthRegisterService.getAll();
    for (const register of registers) {
        const stats = await this.healthRecordService.calculateUserStats(register.user.userId, register.health.id);
        console.log(stats);
        await this.saveUserStats(register.user.userId, register.health.id, stats);
    }
  }

  async saveUserStats(userId: string, healthId: number, stats: { totalDays: number, longestStreak: number }) {
    return await this.healthStatRepository.saveUserStat(userId, healthId, stats);
  }

  private toHealthStatDto(healthStat: HealthStat): HealthStatDto {
    return {
      totalDays: healthStat.totalDays,
      longestStreak: healthStat.longestStreak
    };
}
}
