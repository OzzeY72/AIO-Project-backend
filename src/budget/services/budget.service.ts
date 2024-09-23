import { Injectable } from '@nestjs/common';
import { CategoryService, ProductService, TagService } from '@/budget/services';
import { CategoryDtoRequest, CategoryDtoResponse, ProductDtoRequest, ProductGetDtoRequest, ProductUpdateDtoRequest } from '@/budget/dto';
import { TagDtoRequest, TagDtoUpdateRequest } from '@/budget/dto';

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
    public createTag = async (userId: string, tag: TagDtoRequest) => {
        tag.userId = userId;
        return await this.tagService.addTag(tag);
    }
    public updateTag = async (userId: string, tag: TagDtoUpdateRequest) => {
        tag.userId = userId;
        return await this.tagService.updateTag(tag);
    }
    public deleteTag = async (id: number) => await this.tagService.deleteTag(id);

    public getProducts = async () => await this.productService.getAllProducts();

    public getProductsByOptions = async (options: ProductGetDtoRequest) => {
        if (options) {
            const tags = Array.isArray(options.tags) ? options.tags : options.tags ? [options.tags] : [];
            options.tags = tags;
            return await this.productService.getProductsByOptions(options);
        }
        else return await this.productService.getAllProducts();
    }

    public getProductById = async (id: number) => await this.productService.getProduct(id);
    public createProduct = async (userId: string, product: ProductDtoRequest) => {
        product.userId = userId;
        return await this.productService.addProduct(product);
    }
    public updateProduct = async (userId: string, product: ProductUpdateDtoRequest) => { 
        product.userId = userId;
        return await this.productService.updateProduct(product);
    }
    public deleteProduct = async (id: number) => await this.productService.deleteProduct(id);
}
