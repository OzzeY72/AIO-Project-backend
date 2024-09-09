import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HealthRecord } from 'src/health';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    provider: string;

    @Column({ nullable: true })
    providerId: string;

    @Column({unique: true})
    userId: string;

    @Column({ nullable: true })
    userLogo: string;

    @Column({ nullable: true })
    accessToken: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date;

    @OneToMany(() => HealthRecord, (healthRecord) => healthRecord.health)
    healthRecords: HealthRecord[];
}
