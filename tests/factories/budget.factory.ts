import { TagDtoResponse } from "@/budget/dto";
import { CategoryEntity, ProductEntity, TagEntity } from "@/budget/entities";

const mockCategory = { 
  id: 1, 
  name: 'Category 1' 
};

const mockTag = {
  id: 1,
  name: 'Tag 1',
  color: '#ffffff',
  category: mockCategory,
};

const mockProduct = {
  id: 1, 
  name: 'Product 1', 
  price: 100,
  date: new Date(undefined),
  tags: [mockTag]
}


export const createMockProduct = (overrides?: Partial<typeof mockProduct>) => ({
  ...mockProduct,
  ...overrides,
});

export const createMockTag = (overrides?: Partial<typeof mockTag>) => ({
  ...mockTag,
  ...overrides,
});

export const createMockCategory = (overrides?: Partial<typeof mockCategory>) => ({
  ...mockCategory,
  ...overrides,
});

const mockEntityCategory: CategoryEntity = { 
  id: 1, 
  name: 'Category 1',
  products: [],
  tags: [],
};

const mockEntityTag: TagEntity = {
  id: 1,
  name: 'Tag 1',
  color: '#ffffff',
  userId: '123',
  category: mockEntityCategory
};

const mockEntityProduct: ProductEntity = { 
  id: 1, 
  name: 'Product 1', 
  price: 100,
  date: new Date(undefined),
  tags: [mockEntityTag],
  userId: '123',
};

export const createMockEntityProduct = (overrides?: Partial<typeof mockEntityProduct>): ProductEntity => ({
  ...mockEntityProduct,
  ...overrides,
});

export const createMockEntityTag = (overrides?: Partial<typeof mockEntityTag>) => ({
  ...mockEntityTag,
  ...overrides,
});

export const createMockEntityCategory = (overrides?: Partial<typeof mockEntityCategory>) => ({
  ...mockEntityCategory,
  ...overrides,
});