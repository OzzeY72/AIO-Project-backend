import { Injectable } from '@nestjs/common';
import { Health, HealthRecord} from './';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HealthService {
    constructor (
        @InjectRepository(Health)
        private readonly healthRepository: Repository<Health>,
        @InjectRepository(HealthRecord)
        private readonly healthRecordRepository: Repository<HealthRecord>,
    ) {}

    async init () {
        const newHealth1 = this.healthRepository.create({
            name: 'Курение',
            description: 'Никотиновая зависимость'
        });
        const newHealth2 = this.healthRepository.create({
            name: 'Кофе',
            description: 'Кофеиновая зависимость'
        });
        this.healthRepository.insert(newHealth1);
        this.healthRepository.insert(newHealth2);
    }
}
