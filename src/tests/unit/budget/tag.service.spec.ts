import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from '@/budget/services';
import { TagRepository } from '@/budget/repositories';
import { createMockEntityTag, createMockEntityCategory } from '@/tests/factories/budget.factory';
import { TagDtoRequest, TagDtoUpdateRequest, toTagDtoResponse, TagDtoResponse } from '@/budget/dto';
import { CategoryEntity, ProductEntity, TagEntity } from '@/budget/entities';

describe('TagService', () => {
  let tagService: TagService;
  let tagRepository: TagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: TagRepository,
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    tagService = module.get<TagService>(TagService);
    tagRepository = module.get<TagRepository>(TagRepository);
  });

  describe('getAllTags', () => {
    it('should call tagRepository.find and return tags', async () => {
      const mockTags = [createMockEntityTag()];
      jest.spyOn(tagRepository, 'find').mockResolvedValue(mockTags);

      const result = await tagService.getAllTags();
      expect(tagRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockTags.map(toTagDtoResponse));
    });
  });

  describe('getTag', () => {
    it('should call tagRepository.findById and return the requested tag', async () => {
      const mockTag = createMockEntityTag({ id: 1 });
      jest.spyOn(tagRepository, 'findById').mockResolvedValue(mockTag);

      const result = await tagService.getTag({ id: 1 });
      expect(tagRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(toTagDtoResponse(mockTag));
    });
  });

  describe('addTag', () => {
    it('should call tagRepository.create and return the created tag', async () => {
      const tagDtoRequest: TagDtoRequest = { 
        name: 'New Tag', 
        color: '#ff0000', 
        userId: '123',
        categoryId: 1 
      };
      const mockTag = createMockEntityTag({ id: 3, ...tagDtoRequest, category: createMockEntityCategory() });

      jest.spyOn(tagRepository, 'create').mockResolvedValue(mockTag);

      const result = await tagService.addTag(tagDtoRequest);
      expect(tagRepository.create).toHaveBeenCalledWith(tagDtoRequest);
      expect(result).toEqual(toTagDtoResponse(mockTag));
    });
  });

  describe('updateTag', () => {
    it('should call tagRepository.update and return the updated tag', async () => {
      const mockTagResponse = createMockEntityTag();
      const updatedTag = { id: 1, name: 'Updated Tag', color: '#000000' };

      jest.spyOn(tagRepository, 'update').mockResolvedValue(createMockEntityTag({ id: 1, ...updatedTag }));

      const result = await tagService.updateTag(updatedTag);
      expect(tagRepository.update).toHaveBeenCalledWith(updatedTag.id, updatedTag);
      expect(result).toEqual(toTagDtoResponse(createMockEntityTag({ id: 1, ...updatedTag })));
    });
  });

  describe('deleteTag', () => {
    it('should call tagRepository.delete and return void', async () => {
      const tagId = 1;

      jest.spyOn(tagRepository, 'delete').mockResolvedValue(undefined);

      const result = await tagService.deleteTag(tagId);
      expect(tagRepository.delete).toHaveBeenCalledWith(tagId);
      expect(result).toBeUndefined();
    });
  });
});
