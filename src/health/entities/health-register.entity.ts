import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Health } from '@/health/entities';
import { User } from '@/user/entities';

@Entity()
@Unique(['userId', 'health'])
export class HealthRegister{
    @PrimaryGeneratedColumn()
    id: number;

    //POSIBLY field active if xor button wouldn't be added.

    @Column({nullable: true})
    countPerDay: number;

    @Column('decimal', { precision: 6, scale: 2 , nullable: true})
    pricePerThing: number;

    @ManyToOne(() => Health, (health) => health.healthRecords)
    health: Health;

    @Column({ name: "userId", nullable: false })
    userId: string;
}