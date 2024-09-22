import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column('int', { array: true, nullable: true })
    products: number[];

    @Column('int', { array: true, nullable: true })
    tags: number[];
}