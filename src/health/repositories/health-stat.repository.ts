import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthStat } from '@/health/entities';
//TODO

@Injectable()
export class HealthStatRepository {
    constructor( 
        @InjectRepository(HealthStat)
        private readonly repository: Repository<HealthStat>,
    ) {}

  async findUserStat(userId: string, healthId: number): Promise<HealthStat | undefined> {
    return await this.repository.findOne({ 
      where: { 
        user: { userId: userId } ,
        health: { id: healthId }
      } 
    });
  }
  async saveUserStat(userId: string, healthId: number, stats: { totalDays: number, longestStreak: number }): Promise<HealthStat | undefined> {
    const stat = this.repository.upsert({
        user: {userId: userId},
        health: {id: healthId},
        ...stats
    },
    ['user','health'],);
    return (await stat).raw[0];
  }

}