import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Health } from '..'
import { User } from 'src/user';

@Entity()
export class HealthRegister{
    @PrimaryGeneratedColumn()
    id: number;

    //POSIBLY field active if xor button wouldn't be added.

    @Column({nullable: true})
    countPerDay: number;

    @ManyToOne(() => Health, (health) => health.healthRecords)
    health: Health;

    @ManyToOne(() => User, (user) => user.healthRecords)
    @JoinColumn({ name: 'userId' })
    user: User;
}