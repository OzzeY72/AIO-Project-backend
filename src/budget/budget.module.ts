import { Module, forwardRef } from '@nestjs/common';
import { JwtAuthModule } from '@/jwtauth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';
import { CategoryService, ProductService, TagService } from '@/budget/services';
import { BudgetService, BudgetController } from '@/budget';
import { AuthorizationModule } from '@/authorization';
import { CategoryRepository, ProductRepository, TagRepository } from './repositories';

@Module({
    imports: [
        forwardRef(() => AuthorizationModule),
        forwardRef(()=>TypeOrmModule.forFeature([ProductEntity, TagEntity, CategoryEntity])),
    ],
    providers: [
        BudgetService,
        CategoryService,
        TagService, 
        ProductService, 
        CategoryRepository,
        TagRepository,
        ProductRepository,
    ],
    controllers: [BudgetController]
})
export class BudgetModule {}
