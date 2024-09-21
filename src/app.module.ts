import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthorizationController, AuthorizationModule } from '@/authorization';
import { UserModule } from '@/user';
import { User } from '@/user/entities';
import { HealthController, HealthModule } from '@/health';
import { Health, HealthRecord, HealthStat, HealthRegister} from '@/health/entities';
import { BudgetModule, BudgetController } from '@/budget';
import { ProductEntity, TagEntity, CategoryEntity } from '@/budget/entities';

@Module({
  imports: [
    AuthorizationModule,
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
    HealthModule,
    UserModule,
    BudgetModule,
  ],
  controllers: [AppController, AuthorizationController, HealthController, BudgetController],
  providers: [AppService],
})  
export class AppModule {}
