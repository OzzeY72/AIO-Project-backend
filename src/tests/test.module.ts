import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/user/user.controller';
import { User } from '@/user/entities';
import { UserService } from '@/user';
import { JwtAuthModule } from '@/jwtauth.module';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';
import { Health, HealthRecord, HealthStat, HealthRegister} from '@/health/entities';
import { Controller, DynamicModule, Provider } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common/interfaces';

export const createTestModule = ({
  controllers = [],
  providers = [],
  imports = [],
}: {
  controllers?: Type<any>[];
  providers?: Provider[];
  imports?: (Type<any> | DynamicModule) [];
} = {}): TestingModuleBuilder => {
  return Test.createTestingModule({
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
      JwtAuthModule,
      ...imports
    ],
    controllers: controllers ?? [],
    providers: providers ?? [],
  })
};
