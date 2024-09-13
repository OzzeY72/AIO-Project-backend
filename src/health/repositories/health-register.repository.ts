import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user';
import { Health, HealthRegister } from '..';

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

    async findAll(): Promise<HealthRegister[] | undefined> {
        return await this.repository.createQueryBuilder('healthRecord')
            .leftJoinAndSelect('healthRecord.user', 'user') 
            .leftJoinAndSelect('healthRecord.health', 'health') 
            .getMany(); 
    }

    async registrate( 
        countPerDay: number | null,
        userId: string, 
        healthId: number
    ): Promise<HealthRegister> {
        const registerRecord = await this.findByUserAndHealth(userId, healthId);
        if (!registerRecord) {
            const healthRegister = await this.repository.create({
                countPerDay, 
                user: {userId: userId},
                health: {id: healthId}
            });
            return await this.repository.save(healthRegister);
        } else {
            return registerRecord;
        }
    }
}