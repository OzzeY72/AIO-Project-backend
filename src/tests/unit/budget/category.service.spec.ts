import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '@/budget/services';
import { CategoryRepository } from '@/budget/repositories';
import { createMockCategory, createMockEntityCategory } from '@/tests/factories/budget.factory';
import { CategoryDtoRequest, CategoryDtoResponse, toCategoryDtoResponse } from '@/budget/dto';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            findCategories: jest.fn(),
            createCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  describe('getAll', () => {
    it('should call categoryRepository.findCategories and return categories', async () => {
      const mockCategories = [createMockEntityCategory()];
      jest.spyOn(categoryRepository, 'findCategories').mockResolvedValue(mockCategories);

      const result = await categoryService.getAll();
      expect(categoryRepository.findCategories).toHaveBeenCalled();
      expect(result).toEqual(mockCategories.map(toCategoryDtoResponse));
    });
  });

  describe('addCategory', () => {
    it('should call categoryRepository.createCategory and return the created category', async () => {
      const categoryDtoRequest: CategoryDtoRequest = { name: 'New Category' };
      const mockCategory = createMockEntityCategory(categoryDtoRequest);

      jest.spyOn(categoryRepository, 'createCategory').mockResolvedValue(mockCategory);

      const result = await categoryService.addCategory(categoryDtoRequest);
      expect(categoryRepository.createCategory).toHaveBeenCalledWith(categoryDtoRequest);
      expect(result).toEqual(toCategoryDtoResponse(mockCategory));
    });
  });

  describe('updateCategory', () => {
    it('should call categoryRepository.updateCategory and return the updated category', async () => {
      const mockCategoryResponse: CategoryDtoResponse = createMockCategory();
      const updatedCategory = createMockEntityCategory({ name: 'Updated Category' });

      jest.spyOn(categoryRepository, 'updateCategory').mockResolvedValue(updatedCategory);

      const result = await categoryService.updateCategory(mockCategoryResponse);
      expect(categoryRepository.updateCategory).toHaveBeenCalledWith(mockCategoryResponse.id, mockCategoryResponse);
      expect(result).toEqual(toCategoryDtoResponse(updatedCategory));
    });
  });

  describe('deleteCategory', () => {
    it('should call categoryRepository.deleteCategory and return void', async () => {
      const categoryId = 1;

      jest.spyOn(categoryRepository, 'deleteCategory').mockResolvedValue(undefined);

      const result = await categoryService.deleteCategory(categoryId);
      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith(categoryId);
      expect(result).toBeUndefined();
    });
  });
});
