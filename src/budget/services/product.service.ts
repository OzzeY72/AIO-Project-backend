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

    async getProduct (id: number): Promise<ProductDtoResponse> {
        const record = await this.productRepository.findProductById(id);
        return toProductDtoResponse(record);
    }

    async addProduct (product: ProductDtoRequest) {
        const record = await this.productRepository.createProduct(product);
        return toProductDtoResponse(record);
    }

    async updateProduct (product: ProductUpdateDtoRequest) {
        const record = await this.productRepository.updateProduct(product);
        return toProductDtoResponse(record);
    }

    async deleteProduct (id: number) {
        return await this.productRepository.deleteProduct(id);
    }
}