import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, ManyToMany, JoinTable } from 'typeorm';
import { User } from '@/user';
import { ProductEntity, CategoryEntity } from '@/budget/entities';

@Entity()
@Unique(['name'])
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'string', nullable: false })
    name: string;

    @Column({ type: 'string', nullable: true })
    color: string;

    @ManyToMany(() => ProductEntity, (product) => product.tags)
    @JoinTable()
    products: ProductEntity[];

    @ManyToOne(() => CategoryEntity, (catrgory) => catrgory.tags)
    category: CategoryEntity;

    @ManyToOne(() => User, (user) => user.healthRecords)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;
}