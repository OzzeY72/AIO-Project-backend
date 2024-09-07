import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column()
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

}