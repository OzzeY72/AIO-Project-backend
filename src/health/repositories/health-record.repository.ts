import { Repository, Between } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthRecord } from '@/health/entities';

@Injectable()
export class HealthRecordRepository {
    constructor( 
        @InjectRepository(HealthRecord)
        private readonly repository: Repository<HealthRecord>,
    ) {}

    async findAllByUserAndHealth(
        userId: string, 
        healthId: number,
        month: number,
        year: number,
    ) {
        const startOfMonth = month ? new Date(year, month - 1, 1) : new Date(2000,0,1);
        const endOfMonth = month ? new Date(year, month, 0) : new Date(2200,0,1); 
        return await this.repository.find({
            where: {
                userId,
                health: { id: healthId },
                streakBegin: Between(startOfMonth, endOfMonth),
            },
        });
    }

    async findByStreakEnd(streakEnd: Date | null, userId: string, healthId: number): Promise<HealthRecord | undefined> {
        return await this.repository.findOne({ 
            where: {
                streakEnd: streakEnd,
                userId,
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
                userId,
                health: { id: healthId },
            },
          order: { id: 'DESC' },
        });
    }

    async createNewStreak(
        streakStart: Date | undefined, 
        streakEnd: Date | null, 
        userId: string, 
        healthId: number
    ): Promise<HealthRecord> {
        let streakBegin = streakStart ? streakStart : new Date();
        const healthRecord = await this.repository.create({
            streakBegin, 
            streakEnd,
            userId,
            health: {id: healthId}
        });
        console.log(healthRecord);
        console.log(healthRecord.userId);
        return await this.repository.save(healthRecord);
    }
}