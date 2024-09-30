import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@/budget/services';
import { ProductRepository } from '@/budget/repositories';
import { ProductDtoRequest, ProductUpdateDtoRequest, ProductDtoResponse, toProductDtoResponse, ProductGetDtoRequest } from '@/budget/dto';
import { createMockEntityTag, createMockEntityCategory } from '../../factories/budget.factory'; 
import { ProductEntity } from '@/budget/entities';

const mockEntityProduct = {
  id: 1,
  name: 'Product 1',
  price: 100,
  date: new Date(),
  tags: [createMockEntityTag()],
};

const createMockEntityProduct = (overrides?: Partial<typeof mockEntityProduct>) => ({
  ...mockEntityProduct,
  ...overrides,
});

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            findProducts: jest.fn(),
            findProductById: jest.fn(),
            findProductsWithOptions: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  describe('getAllProducts', () => {
    it('should call productRepository.findProducts and return products', async () => {
      const mockProducts = [createMockEntityProduct()] as ProductEntity[];
      jest.spyOn(productRepository, 'findProducts').mockResolvedValue(mockProducts);

      const result = await productService.getAllProducts();
      expect(productRepository.findProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts.map(toProductDtoResponse));
    });
  });

  describe('getProduct', () => {
    it('should call productRepository.findProductById and return the requested product', async () => {
      const mockProduct = createMockEntityProduct() as ProductEntity;
      jest.spyOn(productRepository, 'findProductById').mockResolvedValue(mockProduct);

      const result = await productService.getProduct(1);
      expect(productRepository.findProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(toProductDtoResponse(mockProduct));
    });
  });

  describe('getProductsByOptions', () => {
    it('should call productRepository.findProductsWithOptions and return products based on options', async () => {
      const options: ProductGetDtoRequest = { tags: [1, 2] };
      const mockProducts = [createMockEntityProduct(), createMockEntityProduct({ id: 2 })] as ProductEntity[];
      jest.spyOn(productRepository, 'findProductsWithOptions').mockResolvedValue(mockProducts);

      const result = await productService.getProductsByOptions(options);
      expect(productRepository.findProductsWithOptions).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockProducts.map(toProductDtoResponse));
    });
  });

  describe('addProduct', () => {
    it('should call productRepository.createProduct and return the created product', async () => {
      const productDtoRequest = { name: 'New Product', price: 200, tags: [] };
      const mockProduct = createMockEntityProduct({ id: 3, ...productDtoRequest }) as ProductEntity;

      jest.spyOn(productRepository, 'createProduct').mockResolvedValue(mockProduct);

      const result = await productService.addProduct(productDtoRequest as ProductDtoRequest);
      expect(productRepository.createProduct).toHaveBeenCalledWith(productDtoRequest);
      expect(result).toEqual(toProductDtoResponse(mockProduct));
    });
  });

  describe('updateProduct', () => {
    it('should call productRepository.updateProduct and return the updated product', async () => {
      const mockProductResponse = createMockEntityProduct();
      const updatedProduct = { id: 1, name: 'Updated Product', price: 150, tags: [] };

      jest.spyOn(productRepository, 'updateProduct').mockResolvedValue(createMockEntityProduct({ id: 1, ...updatedProduct }) as ProductEntity);

      const result = await productService.updateProduct(updatedProduct as ProductUpdateDtoRequest);
      expect(productRepository.updateProduct).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(toProductDtoResponse(createMockEntityProduct({ id: 1, ...updatedProduct }) as ProductEntity));
    });
  });

  describe('deleteProduct', () => {
    it('should call productRepository.deleteProduct and return void', async () => {
      const productId = 1;

      jest.spyOn(productRepository, 'deleteProduct').mockResolvedValue(undefined);

      const result = await productService.deleteProduct(productId);
      expect(productRepository.deleteProduct).toHaveBeenCalledWith(productId);
      expect(result).toBeUndefined();
    });
  });
});
