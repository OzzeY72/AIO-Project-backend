import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthorizationModule } from '@/authorization';
import { ExerciseDay, ExerciseEntity, ExerciseRecordEntity, PlanExercise, PlanExerciseDay, PlannedExerciseSet } from '@/sport/entities';
import { SportModule } from '@/sport/sport.module';
import { UserModule } from '@/user';
import { User } from '@/user/entities';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from './jwtauth.module';
import { MuscleGroupEntity } from './sport/entities/muscle-group.entity';

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
          ExerciseEntity, ExerciseRecordEntity, PlanExercise, PlanExerciseDay, ExerciseDay,
          PlannedExerciseSet, MuscleGroupEntity
        ],
        synchronize: true,
        //logging: true,
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    SportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})  
export class AppModule {}
