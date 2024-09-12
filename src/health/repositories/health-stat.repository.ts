import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HealthStat } from '../entities/health-stat.entity';
import { InjectRepository } from '@nestjs/typeorm';

//TODO

@Injectable()
export class HealthStatRepository {
    constructor( 
        @InjectRepository(HealthStat)
        private readonly repository: Repository<HealthStat>,
    ) {}

  async findUserStat(userId: number, healthId: number): Promise<HealthStat | undefined> {
    return await this.repository.findOne({ 
      where: { 
        user: { id: userId } ,
        health: { id: healthId }
      } 
    });
  }
  async saveUserStat(userId: number, healthId: number, stats: { totalDays: number, longestStreak: number }): Promise<HealthStat | undefined> {
    const stat = this.repository.upsert({
        user: {id: userId},
        health: {id: healthId},
        ...stats
    },
    ['user','health'],);
    return (await stat).raw[0];
  }

}