import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/budget/entities';
import { ProductDtoRequest, ProductUpdateDtoRequest, ProductGetDtoRequest } from '@/budget/dto';

@Injectable()
export class ProductRepository {
    constructor( 
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>,
    ) {}

    async findProducts (): Promise<ProductEntity[]> {
        const query = this.repository.createQueryBuilder('product')
            .leftJoinAndSelect('product.tags', 'tag')
            .leftJoinAndSelect('product.category', 'category')
        const result = query.getMany();
        console.log(result);
        return result;
    }

    async findProductsWithOptions (product: ProductGetDtoRequest): Promise<ProductEntity[]> {
        const cd = new Date() //current Date
        const first = product?.month ? new Date(product?.year ? product.year : cd.getFullYear(), 1) : 
            product?.year ? new Date(product.year, cd.getMonth()-1, 1) : null;

        const second = product?.month ? new Date(product?.year ? product.year : cd.getFullYear(), -1) : 
            product?.year ? new Date(product.year, cd.getMonth()-1, -1) : null;
            
        const query = this.repository.createQueryBuilder('product')
            .leftJoinAndSelect('product.tags', 'tag')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.id > 0')

        if (!!first && !!second) {
            query.andWhere('product.date > :first and product.date < :second', {
                first: first.getTime(),
                second: second.getTime(),
            });
        } 

        if (product?.tags && product.tags.length > 0) {
            query.andWhere('tag.id IN (:...tag)', { tag: product.tags });
        }

        if (product?.category) {
            query.andWhere('category.id = :category', { category: product.category });
        }

        const result = await query.getMany();
        console.log(result);
        return result;
    }

    async findProductById (id: number): Promise<ProductEntity> {
        const query = this.repository.createQueryBuilder('product')
            .leftJoinAndSelect('product.tags', 'tag')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.id = :id', { id: id });

        const result = await query.getOne();
        console.log(result);
        return result;
    }

    async updateProduct (product: ProductUpdateDtoRequest) {
        const productRecord = this.repository.create({
            id: product?.id,
            name: product?.name,
            price: product?.price,
            date: product?.date,
            tags: product?.tags.map(tagId => ({ id: tagId })),
            category: { id: product?.category },
        });
        await this.repository.update(product.id, productRecord);
        return await this.repository.findOne({where: {id: product.id}});
    }

    async deleteProduct (id: number): Promise<void> {
        await this.repository.delete(id);
    } 

    async createProduct (product: ProductDtoRequest): Promise<ProductEntity> {
        const productRecord = this.repository.create({
            name: product.name,
            price: product.price,
            date: product.date,
            tags: product.tags.map(tagId => ({ id: tagId })),
            category: { id: product.category },
        });
        return await this.repository.save(productRecord);
    }
}