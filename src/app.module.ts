import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { HealthModule } from './health/health.module';
import { Health, HealthRecord, HealthStat, HealthRegister} from './health'
import { BudgetController } from './budget/budget.controller';
import { BudgetModule } from './budget/budget.module';

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
        entities: [User, Health, HealthRecord, HealthStat, HealthRegister],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    UserModule,
    BudgetModule,
  ],
  controllers: [AppController, AuthorizationController, BudgetController],
  providers: [AppService],
})  
export class AppModule {}
