import { Controller, Get, Put, Body, Post, Res, UseGuards, Delete, Param, HttpStatus, Req, Query} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/authorization';
import { handleControllerError } from '@/common/utils';
import { CategoryDtoRequest, CategoryDtoResponse, ProductDtoRequest, ProductDtoResponse, ProductGetDtoRequest, ProductUpdateDtoRequest } from '@/budget/dto';
import { TagDtoRequest, TagDtoResponse, TagDtoUpdateRequest } from '@/budget/dto';
import { Response } from 'express';
import { BudgetService } from '@/budget/services';

@ApiTags('budget')
@Controller('budget')
export class BudgetController {
    constructor (
        private budgetService: BudgetService,
    ) {} 

    // Categories
    @Get('category')
    @ApiOperation({ summary: 'Get all categories' })
    @ApiOkResponse({
        description: 'List of categories',
        type: [CategoryDtoResponse],
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getCategories(@Res() res: Response): Promise<CategoryDtoResponse[]> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.getCategories())
        );
    }

    @Post('category')
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CategoryDtoRequest })
    @ApiOkResponse({
        description: 'The created category',
        type: CategoryDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createCategory(@Body() category: CategoryDtoRequest, @Res() res: Response): Promise<CategoryDtoResponse> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.createCategory(category))
        );
    }

    @Put('category')
    @ApiOperation({ summary: 'Update an existing category' })
    @ApiBody({ type: CategoryDtoResponse })
    @ApiOkResponse({
        description: 'The updated category',
        type: CategoryDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateCategory(@Body() category: CategoryDtoResponse, @Res() res: Response): Promise<CategoryDtoResponse> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.updateCategory(category))
        );
    }

    @Delete('category/:id')
    @ApiOperation({ summary: 'Delete a category' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiOkResponse({ description: 'Category deleted' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteCategory(@Param('id') id: number, @Res() res: Response): Promise<void> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.deleteCategory(id))
        );
    }

    // Tags
    @Get('tag')
    @ApiOperation({ summary: 'Get all tags' })
    @ApiOkResponse({
        description: 'List of tags',
        type: [TagDtoResponse],
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getTags(@Res() res: Response): Promise<TagDtoResponse[]> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.getTags())
        );
    }

    @Get('tag/:id')
    @ApiOperation({ summary: 'Get a tag by id' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiOkResponse({
        description: 'Tag details',
        type: TagDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getTagById(@Param('id') id: number, @Res() res: Response): Promise<TagDtoResponse> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.getTagById(id))
        );
    }

    @Post('tag')
    @ApiOperation({ summary: 'Create a new tag' })
    @ApiBody({ type: TagDtoRequest })
    @ApiOkResponse({
        description: 'The created tag',
        type: TagDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createTag(
        @Req() request: any,
        @Body() tag: TagDtoRequest, 
        @Res() res: Response
    ): Promise<TagDtoResponse> {
        const userId = request.user.sub; 
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.createTag(userId, tag))
        );
    }

    @Put('tag')
    @ApiOperation({ summary: 'Update an existing tag' })
    @ApiBody({ type: TagDtoUpdateRequest })
    @ApiOkResponse({
        description: 'The updated tag',
        type: TagDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateTag(
        @Req() request: any,
        @Body() tag: TagDtoUpdateRequest, 
        @Res() res: Response
    ): Promise<TagDtoResponse> {
        const userId = request.user.sub; 
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.updateTag(userId, tag))
        );
    }

    @Delete('tag/:id')
    @ApiOperation({ summary: 'Delete a tag' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiOkResponse({ description: 'Tag deleted' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteTag(@Param('id') id: number, @Res() res: Response): Promise<void> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.deleteTag(id))
        );
    }

    // Products
    @Get('product')
    @ApiOperation({ summary: 'Get all products with filter' })
    @ApiQuery({ description: 'Get products with filters', type: ProductGetDtoRequest })
    @ApiOkResponse({
        description: 'List of products',
        type: [ProductDtoResponse],
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getProducts(
        @Res() res: Response,
        @Query() options?: ProductGetDtoRequest,
    ): Promise<ProductDtoRequest[]> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.getProductsByOptions(options))
        );
    }

    @Get('product/:id')
    @ApiOperation({ summary: 'Get a product by id' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiOkResponse({
        description: 'Product details',
        type: ProductDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getProductById(@Param('id') id: number, @Res() res: Response): Promise<ProductDtoRequest> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.getProductById(id))
        );
    }

    @Post('product')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiBody({ type: ProductDtoRequest })
    @ApiOkResponse({
        description: 'The created product',
        type: ProductDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Req() request: any,
        @Body() product: ProductDtoRequest, 
        @Res() res: Response
    ): Promise<ProductDtoRequest> {
        const userId = request.user.sub; 
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.createProduct(userId, product))
        );
    }

    @Put('product')
    @ApiOperation({ summary: 'Update an existing product' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: ProductUpdateDtoRequest })
    @ApiOkResponse({
        description: 'The updated product',
        type: ProductDtoResponse,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updateProduct(
        @Req() request: any,
        @Body() product: ProductUpdateDtoRequest, 
        @Res() res: Response
    ): Promise<ProductUpdateDtoRequest> {
        const userId = request.user.sub; 
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.updateProduct(userId, product))
        );
    }

    @Delete('product/:id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiOkResponse({ description: 'Product deleted' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteProduct(@Param('id') id: number, @Res() res: Response): Promise<void> {
        return handleControllerError(res, async () => 
            res.status(HttpStatus.OK).json(await this.budgetService.deleteProduct(id))
        );
    }  
}