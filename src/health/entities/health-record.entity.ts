import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Health } from './health.entity'
import { User } from 'src/user';

@Entity()
export class HealthRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    streakBegin: string;

    @Column({ nullable: true })
    streakEnd: string;

    @ManyToOne(() => Health, (health) => health.healthRecords)
    health: Health;

    @ManyToOne(() => User, (user) => user.healthRecords)
    @JoinColumn({ name: 'userId' })
    user: User;
}