import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Health } from '..'
import { User } from 'src/user';

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

    @ManyToOne(() => User, (user) => user.healthRecords)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;
}