import { Injectable } from '@nestjs/common';
import { toProductDtoResponse, ProductDtoResponse, ProductDtoRequest, ProductUpdateDtoRequest } from '@/budget/dto';
import { ProductRepository } from '@/budget/repositories';
import { ProductEntity } from '@/budget/entities';

@Injectable()
export class ProductService {
    constructor (
        private readonly productRepository: ProductRepository,
    ) {}

    async getAllProducts () {
        const records = await this.productRepository.findProducts();
        return records.map(toProductDtoResponse);
    }

    async getProduct (conditions: Partial<ProductEntity>): Promise<ProductDtoResponse> {
        const record = await this.productRepository.findProduct(conditions);
        return toProductDtoResponse(record);
    }

    async addProduct (product: ProductDtoRequest) {
        return await this.productRepository.createProduct(product);
    }

    async updateProduct (product: ProductUpdateDtoRequest) {
        return await this.productRepository.updateProduct(product);
    }

    async deleteProduct (id: number) {
        return await this.productRepository.deleteProduct(id);
    }
}