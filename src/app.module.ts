import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthorizationController, AuthorizationModule } from '@/authorization';
import { UserModule } from '@/user';
import { User } from '@/user/entities';
import { HealthModule } from '@/health/health.module';
import { Health, HealthRecord, HealthStat, HealthRegister} from '@/health/entities';
import { BudgetModule } from '@/budget/budget.module';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';
import { JwtAuthModule } from './jwtauth.module';

@Module({
  imports: [
    forwardRef(() => JwtAuthModule),
    forwardRef(() => AuthorizationModule),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User, 
          Health, HealthRecord, HealthStat, HealthRegister,
          ProductEntity, TagEntity, CategoryEntity,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => BudgetModule),
    forwardRef(() => HealthModule),
  ],
  controllers: [AppController, AuthorizationController],
  providers: [AppService],
})  
export class AppModule {}
