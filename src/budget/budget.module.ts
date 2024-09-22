import { Module, forwardRef } from '@nestjs/common';
import { JwtAuthModule } from '@/jwtauth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';
import { CategoryService, ProductService, TagService, BudgetService } from '@/budget/services';
import { BudgetController } from './budget.controller';
import { AuthorizationModule } from '@/authorization';
import { CategoryRepository, ProductRepository, TagRepository } from '@/budget/repositories';

@Module({
    imports: [
        AuthorizationModule,
        JwtAuthModule,
        forwardRef(() => TypeOrmModule.forFeature([ProductEntity, TagEntity, CategoryEntity])),
    ],
    controllers: [BudgetController],
    providers: [
        CategoryRepository,
        TagRepository,
        ProductRepository,
        CategoryService,
        TagService, 
        ProductService, 
        BudgetService,
    ],
})
export class BudgetModule {}
