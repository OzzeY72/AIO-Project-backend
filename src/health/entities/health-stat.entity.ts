import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Health } from '@/health/entities';
import { User } from '@/user/entities';

@Entity()
@Unique(['user', 'health'])
export class HealthStat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, default: 0 })
    totalDays: number;

    @Column({ nullable: false, default: 0})
    longestStreak: number;

    @ManyToOne(() => Health, (health) => health.healthRecords)
    health: Health;

    @Column({ name: "userId", nullable: false })
    userId: string;
}