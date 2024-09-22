import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, ManyToMany, JoinTable } from 'typeorm';
import { CategoryEntity } from '@/budget/entities';

@Entity()
@Unique(['name'])
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    color: string;

    @Column('int', { array: true, nullable: true })
    products: number[];

    @ManyToOne(() => CategoryEntity, (catrgory) => catrgory.tags)
    category: CategoryEntity;

    @Column({ name: "userId", nullable: false })
    userId: string;
}