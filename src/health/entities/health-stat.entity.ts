import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Health } from './health.entity'
import { User } from 'src/user';

@Entity()
export class HealthStat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, default: 0 })
    days: number;

    @Column({ nullable: false, default: 0})
    longestStreak: number;

    @ManyToOne(() => Health, (health) => health.healthRecords)
    health: Health;

    @ManyToOne(() => User, (user) => user.healthRecords)
    @JoinColumn({ name: 'userId' })
    user: User;
}