import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { CategoryEntity, TagEntity } from '@/budget/entities';

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    price: number;

    //@Column('timestamp',{ nullable: false})
    @Column('datetime',{ nullable: false})
    date: Date;

    @ManyToMany(() => TagEntity, (tag) => tag.products)
    tags: TagEntity[];

    @Column({ name: "userId", nullable: false })
    userId: string;
}