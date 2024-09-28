import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/user/user.controller';
import { User } from '@/user/entities';
import { UserService } from '@/user';
import { JwtAuthModule } from '@/jwtauth.module';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';
import { Health, HealthRecord, HealthStat, HealthRegister} from '@/health/entities';

export const createTestModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [
          User, 
          Health, HealthRecord, HealthStat, HealthRegister,
          ProductEntity, TagEntity, CategoryEntity,
        ],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([User]),
      JwtAuthModule,
    ],
    controllers: [UserController],
    providers: [UserService],
  }).compile();
};
