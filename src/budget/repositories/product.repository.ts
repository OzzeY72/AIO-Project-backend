import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/budget/entities';
import { ProductDtoRequest, ProductUpdateDtoRequest, ProductGetDtoRequest } from '@/budget/dto';
import { ProductDtoCreateRequest } from '../dto/product.dto';
import { TagRepository } from './tag.repository';

@Injectable()
export class ProductRepository {
    constructor( 
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>,
        private tagRepository: TagRepository,
    ) {}

    async findProducts (): Promise<ProductEntity[]> {
        const query = this.repository.createQueryBuilder('product')
            .leftJoinAndSelect('product.tags', 'tag')
            .leftJoinAndSelect('tag.category', 'category')
        const result = await query.getMany();
        console.log(result);
        return result;
    }

    async findProductsWithOptions (options: ProductGetDtoRequest): Promise<ProductEntity[]> {
        const currentDate = new Date();
        const year = options?.year || currentDate.getFullYear();
        const month = options?.month ? options.month - 1 : currentDate.getMonth();

        const first = (options?.month && month >= 0 && month <= 11) ? 
            new Date(year, month, 1) : 
            (options?.year ? new Date(year, currentDate.getMonth() - 1, 1) : null);

        const second = (options?.month && month >= 0 && month <= 11) ? 
            new Date(year, month + 1, 0) : // последний день месяца
            (options?.year ? new Date(year, currentDate.getMonth() - 1, 0) : null);

        const query = this.repository.createQueryBuilder('product')
            .leftJoinAndSelect('product.tags', 'tag')
            .leftJoinAndSelect('tag.category', 'category')
            .where('product.id > 0')

        if (options?.name) {
            query.andWhere('product.name LIKE :name', {name: `%${options.name}%`});
        }
        
        if (!!first && !!second) {
            query.andWhere('product.date > :first and product.date < :second', {
                first: first.toISOString(),
                second: second.toISOString(),
            });
        } 

        if (options?.tags && options.tags.length > 0) {
            query.andWhere('tag.id IN (:...tag)', { tag: options.tags });
        }

        if (options?.category) {
            query.andWhere('tag.category.id = :category', { category: options.category });
        }

        const result = await query.getMany();
        console.log(result);
        return result;
    }

    async findProductById (id: number): Promise<ProductEntity> {
        const query = this.repository.createQueryBuilder('product')
            .leftJoinAndSelect('product.tags', 'tag')
            .leftJoinAndSelect('tag.category', 'category')
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
            //tags: product?.tags?.map(tagId => ({ id: tagId })),
        });
        await this.repository.update(product.id, productRecord);
        return await this.repository.findOne({where: {id: product.id}});
    }

    async deleteProduct (id: number): Promise<void> {
        await this.repository.delete(id);
    } 

    async createProduct (product: ProductDtoCreateRequest): Promise<ProductEntity> {
        const tags = await this.tagRepository.findByIds(product.tags);

        const productRecord = this.repository.create({
            name: product.name,
            price: product.price,
            date: product.date,
            tags: tags,
            userId: product.userId
        });
        console.log(productRecord);
        const result = await this.repository.save(productRecord);
        return result;
    }
}