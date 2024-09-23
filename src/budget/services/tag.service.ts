import { Injectable } from '@nestjs/common';
import { TagEntity } from '@/budget/entities';
import { TagRepository } from '@/budget/repositories'; 
import { toTagDtoResponse, TagDtoResponse, TagDtoRequest, TagDtoUpdateRequest } from '@/budget/dto';

@Injectable()
export class TagService {
    constructor (
        private readonly tagRepository: TagRepository,
    ) {}

    async getAllTags () {
        const records = await this.tagRepository.find();
        return records.map(toTagDtoResponse);
    }

    async getTag (conditions: Partial<TagEntity>): Promise<TagDtoResponse> {
        const record = await this.tagRepository.findById(conditions?.id);
        return toTagDtoResponse(record);
    }

    async addTag (tag: TagDtoRequest) {
        const record = await this.tagRepository.create(tag);
        return toTagDtoResponse(record);
    }

    async updateTag (tag: TagDtoUpdateRequest) {
        const record = await this.tagRepository.update(tag.id, tag);
        return toTagDtoResponse(record);
    }

    async deleteTag (id: number) {
        return await this.tagRepository.delete(id);
    }
}