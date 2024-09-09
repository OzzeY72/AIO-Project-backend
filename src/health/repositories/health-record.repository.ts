import { Repository } from 'typeorm';
import { HealthRecord } from '../entities/health-record.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user';
import { Health } from '../entities/health.entity';

@Injectable()
export class HealthRecordRepository {
    constructor( 
        @InjectRepository(HealthRecord)
        private readonly repository: Repository<HealthRecord>,
    ) {}

    async findAllByUserAndHealth(
        userId: string, 
        healthId: number
    ) {
        return await this.repository.find({
            where: {
                user: {userId: userId},
                health: {id: healthId}
            }
        });
    }

    async findByStreakEnd(streakEnd: string | null, userId: string, healthId: number): Promise<HealthRecord | undefined> {
        return await this.repository.findOne({ 
            where: {
                streakEnd: streakEnd,
                user: {userId: userId},
                health: {id: healthId},
            } 
        });
    }

    async updateStreak(id: number, updateData: Partial<HealthRecord>) {
        await this.repository.update(id, updateData);
        return await this.repository.findOne({where: {id: id}});
    }

    async deleteStreak(id: number): Promise<void> {
        await this.repository.delete(id);
    } 

    async findLatestHealthRecord(userId: string, healthId: number): Promise<HealthRecord | undefined> {
        return await this.repository.findOne({
            where: {
                user: { userId: userId },
                health: { id: healthId },
            },
          order: { id: 'DESC' },
        });
    }

    async createNewStreak(
        streakStart: string | undefined, 
        streakEnd: string | null, 
        user: User, 
        health: Health
    ): Promise<HealthRecord> {
        let streakBegin = streakStart ? streakStart : new Date().toLocaleDateString();
        const healthRecord = await this.repository.create({
            streakBegin, 
            streakEnd,
            user,
            health
        });
        return await this.repository.save(healthRecord);
    }
}