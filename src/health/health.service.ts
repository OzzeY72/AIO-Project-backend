import { HttpStatus, Injectable, OnApplicationBootstrap, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthRecordService, HealthRegisterService, HealthStatsService } from '@/health/services';
import { HealthStreakDto, HealthStreakResponseDto, CompleteStatDto } from '@/health/dto';
import { Health } from '@/health/entities';

@Injectable()
export class HealthService implements OnApplicationBootstrap {
    constructor (
        @InjectRepository(Health)
        private readonly healthRepository: Repository<Health>,
        private healthRegisterService: HealthRegisterService,
        private healthRecordService: HealthRecordService,
        private healthStatsService: HealthStatsService,
    ) {}

    async verifyRegistration (
        userId: string, 
        healthId: number
    ) {
        if (!await this.healthRegisterService.isRegistrated(userId, healthId)) {
            throw new HttpException('User is not registrated to health service', HttpStatus.FORBIDDEN);
        }
    }

    async onApplicationBootstrap() {
        await this.healthStatsService.updateUserStats();
        console.log('Updated user stats');
    }

    async getAllByUserAndHealth(
        userId: string, 
        healthId: number,
        month: number,
        year: number,
    ) {
        return await this.healthRecordService.findAllByUserAndHealth(userId, healthId, month, year);
    }

    async getUserStat (userId: string, healthId: number): Promise<CompleteStatDto> {
        return await this.healthStatsService.getCompleteUserStat(userId, healthId);
    }
    
    //Code for registrate endpoint
    async registrateUserToHealth(
        countPerDay: number | null,
        pricePerThing: number | null,
        userId: string, 
        healthId: number
    ) {
        return await this.healthRegisterService.registerUser(countPerDay, pricePerThing, userId, healthId);
    }
    //Code for beginHealthStreak
    async toggleHealthStreak(
        userId: string, 
        healthStreakBody: HealthStreakDto
    ) {
        await this.verifyRegistration(userId, healthStreakBody.healthId);
        if (healthStreakBody.create) {
            return await this.healthRecordService.createNewStreak(userId, healthStreakBody.healthId);
        } else {
            return await this.healthRecordService.endExistingStreak(userId, healthStreakBody.healthId);
        }
    }

    async isStreakExist(
        userId: string, 
        healthId: number
    ): Promise<HealthStreakResponseDto> {
        await this.verifyRegistration(userId, healthId);
        const isExist = await this.healthRecordService.isStreakExist(userId, healthId);
        const status = {
            isExist: isExist,
        }
        return status;
    }

    async init (name: string, description: string) {
        const newHealth = this.healthRepository.create({
            name: name,
            description: description
        });
        await this.healthRepository.insert(newHealth);
    }
}
