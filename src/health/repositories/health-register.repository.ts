import { Repository } from 'typeorm';
import { HealthRegister } from '../entities/health-register.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user';
import { Health } from '../entities/health.entity';

@Injectable()
export class HealthRegisterRepository {
    constructor( 
        @InjectRepository(HealthRegister)
        private readonly repository: Repository<HealthRegister>,
    ) {}

    async findByUserAndHealth(userId: string, healthId: number): Promise<HealthRegister | undefined> {
        return await this.repository.findOne({ 
            where: {
                user: {userId: userId},
                health: {id: healthId},
            } 
        });
    }

    async registrate( 
        countPerDay: number | null,
        user: User, 
        health: Health
    ): Promise<HealthRegister> {
        const registerRecord = await this.findByUserAndHealth(user.userId, health.id);
        if (!registerRecord) {
            const healthRegister = await this.repository.create({
                countPerDay, 
                user,
                health
            });
            return await this.repository.save(healthRegister);
        } else {
            return registerRecord;
        }
    }
}