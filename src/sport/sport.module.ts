import { Module } from '@nestjs/common';
import { JwtAuthModule } from '@/jwtauth.module';
import { AuthorizationModule } from '@/authorization';
import { SportService } from './sport.service';
import { SportController } from './sport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseEntity, ExerciseRecordEntity, PlanExercise, PlanExerciseDay, ExerciseDay } from './entities';
import { ExerciseDayService, ExerciseRecordService, ExerciseService, PlanExerciseDayService, PlanExerciseService } from './services';
import { ExerciseAnalysisService } from './services'; 

@Module({
  imports: [
    AuthorizationModule,
    JwtAuthModule,
    TypeOrmModule.forFeature([ExerciseEntity, ExerciseRecordEntity, PlanExercise, PlanExerciseDay, ExerciseDay]),
  ],
  controllers: [SportController],
  providers: [
    SportService,
    ExerciseDayService,
    ExerciseRecordService,
    ExerciseService,
    PlanExerciseService,
    PlanExerciseDayService,
    ExerciseAnalysisService,
  ],
})
export class SportModule {}
