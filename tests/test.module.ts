import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities';
import { JwtAuthModule } from '@/jwtauth.module';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';
import { Health, HealthRecord, HealthStat, HealthRegister} from '@/health/entities';
import { DynamicModule, ForwardReference, Provider } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common/interfaces';
import { DataSource } from 'typeorm';
import { DataType, newDb } from 'pg-mem';

export const createTestModule = async ({
  controllers = [],
  providers = [],
  imports = [],
}: {
  controllers?: Type<any>[];
  providers?: Provider[];
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>) [];
} = {}): Promise<TestingModuleBuilder> => {
  const db = newDb();

  db.public.registerFunction({
    name: 'current_database',
    returns: DataType.text,
    implementation: () => 'test_db',
  });

  db.public.registerFunction({
    name: 'version',
    returns: DataType.text,
    implementation: () => 'PostgreSQL 13.3', 
  });

  db.public.registerFunction({
    name: 'obj_description',
    args: [DataType.regclass, DataType.text],
    returns: DataType.text,
    implementation: () => null, 
  });

  const connection = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [User],
    synchronize: true
  });

  await connection.initialize();
  const dataSource = connection;

  return Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        url: '',
        entities: [
          User, 
          Health, HealthRecord, HealthStat, HealthRegister,
          ProductEntity, TagEntity, CategoryEntity,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      TypeOrmModule.forFeature([
        User, 
        Health, HealthRecord, HealthStat, HealthRegister,
        ProductEntity, TagEntity, CategoryEntity,
      ]),
      JwtAuthModule,
      ...imports
    ],
    controllers: controllers ?? [],
    providers: providers ?? [],
  })
  .overrideProvider(DataSource)
  .useValue(dataSource);
};


/*TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [
          User, 
          Health, HealthRecord, HealthStat, HealthRegister,
          ProductEntity, TagEntity, CategoryEntity,
        ],
        synchronize: true,
      }),*/