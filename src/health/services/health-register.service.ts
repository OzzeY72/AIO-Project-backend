import { Injectable } from '@nestjs/common';
import { User } from 'src/user';
import { Health, HealthRecord, HealthRegister, HealthRegisterRepository } from '..';

@Injectable()
export class HealthRegisterService {
    constructor (
        private readonly healthRegisterRepository: HealthRegisterRepository,
    ) {}

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
}

/*const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);*/