import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { ProductEntity, TagEntity } from '@/budget';

@Entity()
@Unique(['name'])
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'string', nullable: false })
    name: string;

    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[];

    @OneToMany(() => ProductEntity, (product) => product.category)
    tags: TagEntity[];
}