import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuthorizationCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    clientId: string;

    @Column()
    userId: string;

    @Column()
    redirectUri: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ default: false })
    used: boolean;
}