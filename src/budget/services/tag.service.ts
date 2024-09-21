import { Injectable } from '@nestjs/common';
import { TagEntity } from '@/budget/entities';
import { TagRepository } from '@/budget/repositories'; 
import { toTagDtoResponse, TagDtoResponse, TagDtoRequest } from '@/budget/dto';

@Injectable()
export class TagService {
    constructor (
        private readonly tagRepository: TagRepository,
    ) {}

    async getAllTags () {
        const records = await this.tagRepository.findTags();
        return records.map(toTagDtoResponse);
    }

    async getTag (conditions: Partial<TagEntity>): Promise<TagDtoResponse> {
        const record = await this.tagRepository.findTag(conditions);
        return toTagDtoResponse(record);
    }

    async addTag (tag: TagDtoRequest) {
        return await this.tagRepository.createTag(tag);
    }

    async updateTag (tag: TagDtoResponse) {
        return await this.tagRepository.updateTag(tag.id, tag);
    }

    async deleteTag (id: number) {
        return await this.tagRepository.deleteTag(id);
    }
}