import { Injectable } from '@nestjs/common';
import { HealthRecordRepository } from '@/health/repositories';
import { HealthRecord } from '@/health/entities';
import { HealthRecordDto } from '@/health/dto';
import { calculateDaysBetween, toClearDate } from '@/common/utils';

@Injectable()
export class HealthRecordService {
    constructor (
        private readonly healthRecordRepository: HealthRecordRepository,
    ) {}

    async findAllByUserAndHealth(
        userId: string, 
        healthId: number,
        month?: number,
        year?: number,
    ) {
        if(!year) year = new Date().getFullYear();
        const records = await this.healthRecordRepository.findAllByUserAndHealth(userId, healthId, month, year);
        return records.map(this.toHealthRecordDto);
    }

    async findLast(
        userId: string, 
        healthId: number,
        raw?: boolean
    ) {
        const lastStreak = await this.healthRecordRepository.findLatestHealthRecord(userId, healthId);
        return raw ? lastStreak : this.toHealthRecordDto(lastStreak);
    }

    async endExistingStreak (
        userId: string, 
        healthId: number
    ) {
        const lastStreak = await this.healthRecordRepository.findLatestHealthRecord(userId, healthId);
        if (!lastStreak.streakEnd) {
            lastStreak.streakEnd = new Date();
            //we won't store junk record with < 1 day 
            if (lastStreak.streakBegin === lastStreak.streakEnd) {
                await this.healthRecordRepository.deleteStreak(lastStreak.id);
            } else {
                await this.healthRecordRepository.updateStreak(lastStreak.id, {...lastStreak})
            }
        } else {
            //throw new Error 
            console.error('No continuous streaks');
        }
    }

    async createNewStreak (
        userId: string, 
        healthId: number,
        streakStart?: Date | undefined, 
        streakEnd?: Date | null, 
    ) {
        if (!streakStart) streakStart = new Date();
        streakStart = toClearDate(streakStart);
        const lastStreak = await this.findLast(userId, healthId, true);
        //UNITE close by date records
        //CHECK ability to create new record
        if (
            !lastStreak ||
            (
                lastStreak?.streakEnd && 
                toClearDate(lastStreak?.streakEnd).getTime() !== streakStart.getTime() && 
                toClearDate(lastStreak?.streakBegin).getTime() !== streakStart.getTime()
            )
        ) {
            const healthRecord = await this.healthRecordRepository.createNewStreak(
                streakStart,
                null,
                userId,
                healthId
            );
        } else {
            //throw new Error 
            console.log('Continuous streak exist !');
        }
    }

    async calculateUserStats(userId: string, healthId: number): Promise<{ totalDays: number, longestStreak: number }> {
        const records = await this.findAllByUserAndHealth(userId, healthId);
        
        let totalDays = 0;
        let longestStreak = 0;
        let currentStreak = 0;
        
        records.forEach(record => {
            const streakDays = calculateDaysBetween(record.streakBegin, record.streakEnd);
            console.log(calculateDaysBetween(record.streakBegin, record.streakEnd), record);
            totalDays += streakDays;
            currentStreak = Math.max(currentStreak, streakDays);
        });
        
        longestStreak = currentStreak;
        
        return { totalDays, longestStreak };
    }

    async isStreakExist (
        userId: string, 
        healthId: number
    ): Promise<boolean> {
        const lastStreak = await this.findLast(userId, healthId, true);
        return lastStreak ? !lastStreak.streakEnd : false;
    }

    private toHealthRecordDto(healthRecord: HealthRecord): HealthRecordDto {
        return {
          id: healthRecord.id,
          streakBegin: healthRecord.streakBegin,
          streakEnd: healthRecord.streakEnd ? healthRecord.streakEnd : new Date(),
        };
    }
}

/*const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);*/