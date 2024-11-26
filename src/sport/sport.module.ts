import { Module } from '@nestjs/common';
import { JwtAuthModule } from '@/jwtauth.module';
import { AuthorizationModule } from '@/authorization';
import { SportService } from './sport.service';
import { SportController } from './sport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseEntity, ExerciseRecordEntity, PlanExercise, PlanExerciseDay, ExerciseDay, PlannedExerciseSet } from './entities';
import { ExerciseDayService, ExerciseRecordService, ExerciseService, PlanExerciseDayService, PlanExerciseService, PlanExerciseSetService } from './services';
import { ExerciseAnalysisService } from './services'; 

@Module({
  imports: [
    AuthorizationModule,
    JwtAuthModule,
    TypeOrmModule.forFeature([ExerciseEntity, ExerciseRecordEntity, PlanExercise, PlanExerciseDay, ExerciseDay, PlannedExerciseSet]),
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
    PlanExerciseSetService,
  ],
})
export class SportModule {}
