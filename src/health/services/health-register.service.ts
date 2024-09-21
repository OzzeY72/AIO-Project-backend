import { Injectable } from '@nestjs/common';
import { HealthRegister } from '@/health/entities';
import { HealthRegisterRepository } from '@/health/repositories';
import { HealthRegisterDataDto } from '@/health/dto';

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
        pricePerThing: number | null,
        userId: string, 
        healthId: number
    ) {
        return await this.healthRegisterRepository.registrate(countPerDay, pricePerThing, userId, healthId);
    }

    private toHealthRegisterDataDto(healthRegister: HealthRegister): HealthRegisterDataDto {
        return {
            countPerDay: healthRegister.countPerDay,
            pricePerThing: healthRegister.pricePerThing,
        };
    }
}

/*const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);*/