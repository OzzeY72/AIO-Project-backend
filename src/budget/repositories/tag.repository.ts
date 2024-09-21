import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '@/budget/entities';
import { TagDtoRequest } from '@/budget/dto';

@Injectable()
export class TagRepository {
    constructor( 
        @InjectRepository(TagEntity)
        private readonly repository: Repository<TagEntity>,
    ) {}

    async findTags(): Promise<TagEntity[]> {
      return this.repository.find();
    }

    async findTag(conditions: Partial<TagEntity>): Promise<TagEntity> {
        return this.repository.findOne({ where: conditions });
    }

    async updateTag(id: number, updateData: Partial<TagEntity>) {
        await this.repository.update(id, updateData);
        return await this.repository.findOne({where: {id: id}});
    }

    async deleteTag(id: number): Promise<void> {
        await this.repository.delete(id);
    } 

    async createTag(tag: TagDtoRequest): Promise<TagEntity> {
        const tagRecord = this.repository.create(tag);
        return await this.repository.save(tagRecord);
    }
}