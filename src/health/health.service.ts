import { Injectable } from '@nestjs/common';
import { Health, HealthRecord} from './';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthRecordService } from './services/health-record.service'
import { User } from 'src/user'
import { HealthRegisterService } from './services/health-register.service';
import { UserService } from 'src/user/user.service';
import { throwServiceError } from 'src/common/utils/error-wrapper';
import { HealthStatsService } from './services/health-stat.service'

@Injectable()
export class HealthService {
    constructor (
        @InjectRepository(Health)
        private readonly healthRepository: Repository<Health>,
        private healthRegisterService: HealthRegisterService,
        private healthRecordService: HealthRecordService,
        private healthStatsService: HealthStatsService,
        private userService: UserService,
    ) {}

    async getAllByUserAndHealth(
        userId: string, 
        healthId: number,
        month: number,
        year: number,
    ) {
        return await this.healthRecordService.findAllByUserAndHealth(userId, healthId, month, year);
    }

    async testUpdate() {
        await this.healthStatsService.updateUserStats();
    }

    //Code for registrate endpoint
    async registrateUserToHealth(
        countPerDay: number | null,
        userId: string, 
        healthId: number
    ) {
        await throwServiceError(async () => {
            const user = await this.userService.FindUser({userId: userId});
            const health = await this.healthRepository.findOne({where: {id: healthId}});
            this.healthRegisterService.registerUser(countPerDay, user, health);
        });
        
    }
    //Code for beginHealthStreak
    async beginHealthStreak(
        userId: string, 
        healthId: number
    ) {
        await throwServiceError(async () => {
            if(this.healthRegisterService.isRegistrated(userId, healthId)) {
                const user = await this.userService.FindUser({userId: userId});
                const health = await this.healthRepository.findOne({where: {id: healthId}});
                this.healthRecordService.createNewStreak(undefined,null,user,health);
            } else {
                throw new Error('User is not registrated');
            }
        });
    }
    //Code for endHealthStreak
    async endHealthStreak(
        userId: string, 
        healthId: number
    ) {
        await throwServiceError(async () => {
            if(this.healthRegisterService.isRegistrated(userId, healthId)) {
                const user = await this.userService.FindUser({userId: userId});
                const health = await this.healthRepository.findOne({where: {id: healthId}});
                this.healthRecordService.endExistingStreak(user,health);
            } else {
                throw new Error('User is not registrated');
            }
        });
    }

    async init (name: string, description: string) {
        const newHealth = this.healthRepository.create({
            name: name,
            description: description
        });
        await this.healthRepository.insert(newHealth);
    }
}
