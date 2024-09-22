import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@/budget/repositories';
import { CategoryDtoRequest, toCategoryDtoResponse, CategoryDtoResponse } from '@/budget/dto';

@Injectable()
export class CategoryService {
    constructor (
        private readonly categoryRepository: CategoryRepository,
    ) {}

    async getAll () {
        const records = await this.categoryRepository.findCategories();
        return records.map(toCategoryDtoResponse);
    }

    async addCategory (category: CategoryDtoRequest) {
        const result = await this.categoryRepository.createCategory(category);
        return toCategoryDtoResponse(result);
    }

    async updateCategory (category: CategoryDtoResponse) {
        const result = await this.categoryRepository.updateCategory(category.id, category);
        return toCategoryDtoResponse(result);
    }

    async deleteCategory (id: number) {
        return await this.categoryRepository.deleteCategory(id);
    }
}