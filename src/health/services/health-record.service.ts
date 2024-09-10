import { Injectable } from '@nestjs/common';
import { Health, HealthRecord} from '../';
import { User } from 'src/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthRecordRepository } from '../repositories/health-record.repository'
import { HealthRegisterRepository } from '../repositories/health-register.repository';

@Injectable()
export class HealthRecordService {
    constructor (
        private readonly healthRecordRepository: HealthRecordRepository,
    ) {}

    async findAllByUserAndHealth(
        userId: string, 
        healthId: number
    ) {
        const data = await this.healthRecordRepository.findAllByUserAndHealth(userId, healthId);
        data.at(data.length-1).streakEnd = new Date().toLocaleDateString();
        return data;
    }

    async endExistingStreak (
        user: User, 
        health: Health
    ) {
        const lastStreak = await this.healthRecordRepository.findLatestHealthRecord(user.userId, health.id);
        if (!lastStreak.streakEnd) {
            lastStreak.streakEnd = new Date().toLocaleDateString();
            //we won't store junk record with < 1 day 
            if (lastStreak.streakBegin === lastStreak.streakEnd) {
                await this.healthRecordRepository.deleteStreak(lastStreak.id);
            } else {
                await this.healthRecordRepository.updateStreak(lastStreak.id, {...lastStreak})
            }
        } else {
            //throw new Error 
            console.log('No continuous streaks');
        }
    }

    async createNewStreak (
        streakStart: string | undefined, 
        streakEnd: string | null, 
        user: User, 
        health: Health
    ) {
        if (!streakStart) streakStart = new Date().toLocaleDateString();
        const lastStreak = await this.healthRecordRepository.findLatestHealthRecord(user.userId, health.id);
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
                user,
                health
            );
        } else {
            //throw new Error 
            console.log('Continuous streak exist !');
        }
    }
}

/*const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);*/