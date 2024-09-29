import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from '@/budget/budget.controller';
import { BudgetService } from '@/budget/services';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { CategoryDtoResponse, TagDtoResponse, ProductDtoResponse } from '@/budget/dto';
import { createMockProduct, createMockTag, createMockCategory } from '@/tests/factories/budget.factory';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'crypto';

// Mock data
const mockCategory = createMockCategory() as CategoryDtoResponse;
const mockTag = createMockTag() as TagDtoResponse;
const mockProduct = createMockProduct() as ProductDtoResponse;

describe('BudgetController', () => {
  let controller: BudgetController;
  let budgetService: BudgetService;
  let mockRes: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [
        {
          provide: BudgetService,
          useValue: {
            getCategories: jest.fn().mockResolvedValue([mockCategory]),
            createCategory: jest.fn(),
            updateCategory: jest.fn().mockResolvedValue(mockCategory),
            deleteCategory: jest.fn().mockResolvedValue(undefined),
            getTags: jest.fn().mockResolvedValue([mockTag]),
            getTagById: jest.fn().mockResolvedValue(mockTag),
            createTag: jest.fn(),
            updateTag: jest.fn().mockResolvedValue(mockTag),
            deleteTag: jest.fn().mockResolvedValue(undefined),
            getProductsByOptions: jest.fn().mockResolvedValue([mockProduct]),
            getProductById: jest.fn().mockResolvedValue(mockProduct),
            createProduct: jest.fn().mockResolvedValue(mockProduct),
            updateProduct: jest.fn().mockResolvedValue(mockProduct),
            deleteProduct: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
    budgetService = module.get<BudgetService>(BudgetService);

    // Mock response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getCategories', () => {
    it('should return a list of categories', async () => {
      await controller.getCategories(mockRes as Response);
      expect(budgetService.getCategories).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith([mockCategory]);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const mockCategoryDto = { name: 'New Category' };
      const mockCreateCategory = createMockCategory(mockCategoryDto);
      (budgetService.createCategory as jest.Mock).mockResolvedValue(mockCreateCategory);
      
      await controller.createCategory(mockCategoryDto, mockRes as Response);
      expect(budgetService.createCategory).toHaveBeenCalledWith(mockCategoryDto);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockCreateCategory);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      await controller.updateCategory(mockCategory, mockRes as Response);
      expect(budgetService.updateCategory).toHaveBeenCalledWith(mockCategory);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategory);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      await controller.deleteCategory(1, mockRes as Response);
      expect(budgetService.deleteCategory).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getTags', () => {
    it('should return a list of tags', async () => {
      await controller.getTags(mockRes as Response);
      expect(budgetService.getTags).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith([mockTag]);
    });
  });

  describe('createTag', () => {
    it('should create a tag', async () => {
      const mockReq = { user: { sub: 'userId' } };
      const mockTagDto = { 
        name: 'New Tag',
        color: '#ffffff',
        categoryId: 1
      };
      const mockCreateTag = createMockTag({
        name: mockTagDto.name,
        color: mockTagDto.color, 
        category: createMockCategory({id: mockTagDto.categoryId})
      });
      
      (budgetService.createTag as jest.Mock).mockResolvedValue(mockCreateTag);

      await controller.createTag(mockReq, mockTagDto, mockRes as Response);
      expect(budgetService.createTag).toHaveBeenCalledWith(mockReq.user.sub, mockTagDto);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(mockCreateTag);
    });
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      await controller.getProducts(mockRes as Response);
      expect(budgetService.getProductsByOptions).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith([mockProduct]);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      await controller.deleteProduct(1, mockRes as Response);
      expect(budgetService.deleteProduct).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(undefined);
    });
  });
});
