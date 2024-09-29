import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from '@/budget/services';
import { CategoryService, TagService, ProductService } from '@/budget/services';
import { CategoryDtoRequest, CategoryDtoResponse, ProductDtoRequest, ProductGetDtoRequest, ProductUpdateDtoRequest } from '@/budget/dto';
import { TagDtoRequest, TagDtoUpdateRequest } from '@/budget/dto';
import { createMockCategory, createMockProduct, createMockTag } from '@/tests/factories/budget.factory';

describe('BudgetService', () => {
  let budgetService: BudgetService;
  let categoryService: CategoryService;
  let tagService: TagService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: CategoryService,
          useValue: {
            getAll: jest.fn(),
            addCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
        {
          provide: TagService,
          useValue: {
            getAllTags: jest.fn(),
            getTag: jest.fn(),
            addTag: jest.fn(),
            updateTag: jest.fn(),
            deleteTag: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn(),
            getProductsByOptions: jest.fn(),
            getProduct: jest.fn(),
            addProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    budgetService = module.get<BudgetService>(BudgetService);
    categoryService = module.get<CategoryService>(CategoryService);
    tagService = module.get<TagService>(TagService);
    productService = module.get<ProductService>(ProductService);
  });

  // Categories
  describe('getCategories', () => {
    it('should call categoryService.getAll and return categories', async () => {
      const categories = [createMockCategory()];
      jest.spyOn(categoryService, 'getAll').mockResolvedValue(categories);

      const result = await budgetService.getCategories();
      expect(categoryService.getAll).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('createCategory', () => {
    it('should call categoryService.addCategory and return created category', async () => {
      const categoryDto: CategoryDtoRequest = { name: 'Food' };
      const createdCategory: CategoryDtoResponse = createMockCategory(categoryDto);
      jest.spyOn(categoryService, 'addCategory').mockResolvedValue(createdCategory);

      const result = await budgetService.createCategory(categoryDto);
      expect(categoryService.addCategory).toHaveBeenCalledWith(categoryDto);
      expect(result).toEqual(createdCategory);
    });
  });

  describe('updateCategory', () => {
    it('should call categoryService.updateCategory and return updated category', async () => {
      const categoryDto: CategoryDtoResponse = { id: 1, name: 'Updated Food' };
      jest.spyOn(categoryService, 'updateCategory').mockResolvedValue(createMockCategory(categoryDto));

      const result = await budgetService.updateCategory(categoryDto);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(categoryDto);
      expect(result).toEqual(categoryDto);
    });
  });

  describe('deleteCategory', () => {
    it('should call categoryService.deleteCategory and delete a category', async () => {
      const categoryId = 1;
      jest.spyOn(categoryService, 'deleteCategory').mockResolvedValue(undefined);

      await budgetService.deleteCategory(categoryId);
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(categoryId);
    });
  });

  // Tags
  describe('getTags', () => {
    it('should call tagService.getAllTags and return tags', async () => {
      const tags = [createMockTag()];
      jest.spyOn(tagService, 'getAllTags').mockResolvedValue(tags);

      const result = await budgetService.getTags();
      expect(tagService.getAllTags).toHaveBeenCalled();
      expect(result).toEqual(tags);
    });
  });

  describe('createTag', () => {
    it('should call tagService.addTag with userId and tag', async () => {
      const mockUserId = '123';
      const tagDto: TagDtoRequest = { name: 'Groceries', userId: undefined, categoryId: 1, color: '#ff0000' };
      const createdTag = createMockTag(tagDto);
      jest.spyOn(tagService, 'addTag').mockResolvedValue(createdTag);

      const result = await budgetService.createTag(mockUserId, tagDto);
      expect(tagService.addTag).toHaveBeenCalledWith({ ...tagDto, userId: mockUserId });
      expect(result).toEqual(createdTag);
    });
  });

  // Products
  describe('getProducts', () => {
    it('should call productService.getAllProducts and return products', async () => {
      const products = [createMockProduct()];
      jest.spyOn(productService, 'getAllProducts').mockResolvedValue(products);

      const result = await budgetService.getProducts();
      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('createProduct', () => {
    it('should call productService.addProduct with userId and product', async () => {
      const userId = '123';
      const productDto: ProductDtoRequest = {
        name: 'New Product',
        price: 100,
        date: new Date(),
        tags: [1, 2, 3],
      }
      const createdProduct = createMockProduct({
        ...productDto,
        tags: [createMockTag()]
      });
      
      jest.spyOn(productService, 'addProduct').mockResolvedValue(createdProduct);

      const result = await budgetService.createProduct(userId, productDto);
      expect(productService.addProduct).toHaveBeenCalledWith({ ...productDto, userId: userId });
      expect(result).toEqual(createdProduct);
    });
  });

  // Additional tests can be added for other methods (e.g., updateProduct, deleteProduct, getTagById, etc.)
});
