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
        const record = await this.tagRepository.createTag(tag);
        return toTagDtoResponse(record);
    }

    async updateTag (tag: TagDtoResponse) {
        const record = await this.tagRepository.updateTag(tag.id, tag);
        return toTagDtoResponse(record);
    }

    async deleteTag (id: number) {
        return await this.tagRepository.deleteTag(id);
    }
}