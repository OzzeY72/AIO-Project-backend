import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/budget/entities';
import { ProductDtoRequest, ProductUpdateDtoRequest } from '../dto';

@Injectable()
export class ProductRepository {
    constructor( 
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>,
    ) {}

    async findProducts (): Promise<ProductEntity[]> {
      return this.repository.find();
    }

    async findProduct (conditions: Partial<ProductEntity>): Promise<ProductEntity> {
        return this.repository.findOne({ where: conditions });
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