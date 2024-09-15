import { Injectable } from '@nestjs/common';
import { User } from 'src/user';
import { Health, HealthRecord, HealthRegister, HealthRegisterRepository } from '..';
import { HealthRegisterDataDto } from '../dto/health-register.dto';

@Injectable()
export class HealthRegisterService {
    constructor (
        private readonly healthRegisterRepository: HealthRegisterRepository,
    ) {}

    async getUserRegisterData(userId: string, healthId: number) {
        const registerData = await this.healthRegisterRepository.findByUserAndHealth(userId, healthId);
        return this.toHealthRegisterDataDto(registerData);  
    }

    async isRegistrated (userId: string, healthId: number) {
        return !!await this.healthRegisterRepository.findByUserAndHealth(userId,healthId);
    }

    async getAll(): Promise<HealthRegister[] | undefined> {
        return await this.healthRegisterRepository.findAll();
    }

    async registerUser (
        countPerDay: number | null,
        userId: string, 
        healthId: number
    ) {
        if(!await this.isRegistrated(userId, healthId)) {
            await this.healthRegisterRepository.registrate(countPerDay, userId, healthId);
        }
    }

    private toHealthRegisterDataDto(healthRegister: HealthRegister): HealthRegisterDataDto {
        return {
            countPerDay: healthRegister.countPerDay,
        };
    }
}

/*const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);*/