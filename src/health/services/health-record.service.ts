import { Injectable } from '@nestjs/common';
import { User } from 'src/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthRecordRepository, HealthRecordDto, Health, HealthRecord } from '..';

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
        streakStart: Date | undefined, 
        streakEnd: Date | null, 
        userId: string, 
        healthId: number
    ) {
        if (!streakStart) streakStart = new Date();
        const lastStreak = await this.healthRecordRepository.findLatestHealthRecord(userId, healthId);
        if (
            !lastStreak ||
            (
                lastStreak?.streakEnd && 
                lastStreak?.streakEnd !== streakStart && 
                lastStreak?.streakBegin !== streakStart
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
            const streakDays = this.calculateDaysBetween(record.streakBegin, record.streakEnd);
            totalDays += streakDays;
            currentStreak = Math.max(currentStreak, streakDays);
        });
        
        longestStreak = currentStreak;
        
        return { totalDays, longestStreak };
    }

    calculateDaysBetween(start: Date, end: Date): number {
        const startDate = new Date(start);
        const endDate = new Date(end || new Date());
        return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    private toHealthRecordDto(healthRecord: HealthRecord): HealthRecordDto {
        return {
          id: healthRecord.id,
          streakBegin: healthRecord.streakBegin,
          streakEnd: healthRecord ? healthRecord.streakEnd : new Date(),
        };
    }
}

/*const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);*/