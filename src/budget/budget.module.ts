import { Module } from '@nestjs/common';
import { JwtAuthModule } from '@/jwtauth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';
import { CategoryService, ProductService, TagService } from '@/budget/services';
import { BudgetService, BudgetController } from '@/budget';

@Module({
  imports: [
    JwtAuthModule,
    TypeOrmModule.forFeature([ProductEntity, TagEntity, CategoryEntity]),
  ],
  providers: [BudgetService, CategoryService, TagService, ProductService,],
  controllers: [BudgetController]
})
export class BudgetModule {}
