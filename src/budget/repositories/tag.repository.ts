import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '@/budget/entities';
import { TagDtoRequest, TagDtoUpdateRequest } from '@/budget/dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class TagRepository {
    constructor( 
        @InjectRepository(TagEntity)
        private readonly repository: Repository<TagEntity>,
        private categoryRepository: CategoryRepository,
    ) {}

    async find(): Promise<TagEntity[]> {
      return this.repository.find();
    }

    async findById(id: number): Promise<TagEntity> {
        const query = this.repository.createQueryBuilder('tag')
            .where('tag.id = :id', { id: id });
    
        const result = await query.getOne();
        return result;
    }

    async findByIds(ids: number[]): Promise<TagEntity[]> {
        const query = this.repository.createQueryBuilder('tag')
            .where('tag.id IN (:...id)', { id: ids });
    
        const result = await query.getMany();
        return result;
    }

    async update(id: number, updateData: TagDtoUpdateRequest) {
        const category = await this.categoryRepository.findById(updateData.category);

        await this.repository.update(id, {
            id,
            name: updateData.name,
            color: updateData.color,
            userId: updateData.userId,
            category: category,
        });
        return await this.repository.findOne({where: {id: id}});
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    } 

    async create(tag: TagDtoRequest): Promise<TagEntity> {
        const category = await this.categoryRepository.findById(tag.categoryId);

        const tagRecord = this.repository.create({
            name: tag.name,
            color: tag.color,
            category: category,
            userId: tag.userId,
        });
        return await this.repository.save(tagRecord);
    }
}