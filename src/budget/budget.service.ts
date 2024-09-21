import { Injectable } from '@nestjs/common';
import { CategoryService, ProductService, TagService } from '@/budget/services';
import { CategoryDtoRequest, CategoryDtoResponse, ProductDtoRequest, ProductUpdateDtoRequest } from '@/budget/dto';
import { TagDtoRequest, TagDtoResponse } from '@/budget/dto';

@Injectable()
export class BudgetService {
    constructor (
        private categoryService: CategoryService,
        private tagService: TagService,
        private productService: ProductService,
    ) {}
    
    public getCategories = async () => await this.categoryService.getAll();
    public createCategory = async (category: CategoryDtoRequest) => await this.categoryService.addCategory(category); 
    public updateCategory = async (category: CategoryDtoResponse) => await this.categoryService.updateCategory(category);
    public deleteCategory = async (id: number) => await this.categoryService.deleteCategory(id);

    public getTags = async () => await this.tagService.getAllTags();
    public getTagById = async (id: number) => await this.tagService.getTag({id: id});
    public createTag = async (tag: TagDtoRequest) => await this.tagService.addTag(tag); 
    public updateTag = async (tag: TagDtoResponse) => await this.tagService.updateTag(tag);
    public deleteTag = async (id: number) => await this.tagService.deleteTag(id);

    public getProducts = async () => await this.productService.getAllProducts();
    public getProductById = async (id: number) => await this.productService.getProduct({id: id});
    public createProduct = async (product: ProductDtoRequest) => await this.productService.addProduct(product); 
    public updateProduct = async (id: number, product: ProductUpdateDtoRequest) => await this.productService.updateProduct(product);
    public deleteProduct = async (id: number) => await this.productService.deleteProduct(id);
}
