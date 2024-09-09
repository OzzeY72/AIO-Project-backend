import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HealthStat } from '../entities/health-stat.entity';
 
//TODO

@Injectable()
export class HealthStatRepository extends Repository<HealthStat> {
  async getUserStreak(userId: number): Promise<HealthStat | undefined> {
    return await this.findOne({ where: { user: { id: userId } } });
  }

}