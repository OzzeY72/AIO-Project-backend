import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Health } from '@/health/entities';
import { User } from '@/user/entities';

@Entity()
export class HealthRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', nullable: false })
    //@Column({ type: 'date', nullable: false })
    streakBegin: Date;

    @Column({ type: 'timestamp', nullable: true })
    //@Column({ type: 'date', nullable: true })
    streakEnd: Date;

    @ManyToOne(() => Health, (health) => health.healthRecords)
    health: Health;

    @Column({ name: "userId", nullable: false })
    userId: string;
}