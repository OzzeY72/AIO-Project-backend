import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({nullable: true})
    password: string;

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
    //@Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    //@Column({ type: 'date', nullable: true })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    //@Column({ type: 'date', nullable: true })
    lastLogin: Date;
}
