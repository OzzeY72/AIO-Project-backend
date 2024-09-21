import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthModule } from '@/jwtauth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';

@Module({
  imports: [
    JwtAuthModule,
    TypeOrmModule.forFeature([ProductEntity, TagEntity, CategoryEntity]),
  ],
  providers: [BudgetService]
})
export class BudgetModule {}
