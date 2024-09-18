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
        pricePerThing: number | null,
        userId: string, 
        healthId: number
    ): Promise<HealthRegister> {
        console.log(
            countPerDay,
            pricePerThing,
            userId,
            healthId,
        );
        const healthRegister = await this.repository.create({
            countPerDay, 
            pricePerThing,
            user: {id: 1, userId: userId},
            health: {id: healthId}
        });
        const query = await this.repository.upsert(healthRegister,['user','health']);
        return query.raw[0];
    }
}