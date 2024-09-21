import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HealthRecord } from '@/health/entities';

@Entity()
export class Health {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true})
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => HealthRecord, (healthRecord) => healthRecord.health)
    healthRecords: HealthRecord[];
}