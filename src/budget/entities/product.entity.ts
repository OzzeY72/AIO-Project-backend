import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from 'src/user';
import { CategoryEntity, TagEntity } from 'src/budget';

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'string', nullable: false })
    name: string;

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    price: number;

    @Column('timestamp',{ nullable: false})
    date: Date;

    @ManyToMany(() => TagEntity, (tag) => tag.products)
    tags: TagEntity[];

    @ManyToOne(() => CategoryEntity, (catrgory) => catrgory.products)
    category: CategoryEntity;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;
}