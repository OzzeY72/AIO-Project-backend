import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Health} from './';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthRecordService } from './services/health-record.service'
import { HealthRegisterService } from './services/health-register.service';
import { HealthStatsService } from './services/health-stat.service'
import { CompleteStatDto } from './dto/health-stat.dto';

@Injectable()
export class HealthService implements OnApplicationBootstrap {
    constructor (
        @InjectRepository(Health)
        private readonly healthRepository: Repository<Health>,
        private healthRegisterService: HealthRegisterService,
        private healthRecordService: HealthRecordService,
        private healthStatsService: HealthStatsService,
    ) {}

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
        userId: string, 
        healthId: number
    ) {
        await this.healthRegisterService.registerUser(countPerDay, userId, healthId);
    }
    //Code for beginHealthStreak
    async beginHealthStreak(
        userId: string, 
        healthId: number
    ) {
        if(await this.healthRegisterService.isRegistrated(userId, healthId)) {
            await this.healthRecordService.createNewStreak(undefined,null,userId,healthId);
        } else {
           //throw new Error
           console.log('User is not registrated');
        }
    }
    //Code for endHealthStreak
    async endHealthStreak(
        userId: string, 
        healthId: number
    ) {
        if(this.healthRegisterService.isRegistrated(userId, healthId)) {
            await this.healthRecordService.endExistingStreak(userId,healthId);
        } else {
            //throw new Error
            console.log('User is not registrated');
        }
    }

    async init (name: string, description: string) {
        const newHealth = this.healthRepository.create({
            name: name,
            description: description
        });
        await this.healthRepository.insert(newHealth);
    }
}
