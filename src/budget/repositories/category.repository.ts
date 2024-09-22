import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '@/budget/entities';
import { CategoryDtoRequest, CategoryDtoResponse } from '@/budget/dto';

@Injectable()
export class CategoryRepository {
    constructor( 
        @InjectRepository(CategoryEntity)
        private readonly repository: Repository<CategoryEntity>,
    ) {}

    async findCategories() {
        return await this.repository.find();
    }

    async findById(id: number): Promise<CategoryEntity> {
        return await this.repository.findOne({where: {id: id}});
    }

    async updateCategory(id: number, updateData: CategoryDtoResponse) {
        await this.repository.update(id, updateData);
        return await this.repository.findOne({where: {id: id}});
    }

    async deleteCategory(id: number): Promise<void> {
        await this.repository.delete(id);
    } 

    async createCategory(category: CategoryDtoRequest): Promise<CategoryEntity> {
        const categoryRecord = this.repository.create(category);
        const result = await this.repository.save(categoryRecord);
        return result;
    }
}