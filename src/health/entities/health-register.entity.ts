import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Health } from '..'
import { User } from 'src/user';

@Entity()
@Unique(['user', 'health'])
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

    @ManyToOne(() => User, (user) => user.healthRecords)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;
}