import { Injectable } from '@nestjs/common';
import { Health, HealthRecord, HealthRegister} from '../';
import { User } from 'src/user';
import { HealthRegisterRepository } from '../repositories/health-register.repository';

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
        user: User, 
        health: Health
    ) {
        if(!await this.isRegistrated(user.userId, health.id)) {
            await this.healthRegisterRepository.registrate(countPerDay,user, health);
        }
    }
}

/*const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);*/