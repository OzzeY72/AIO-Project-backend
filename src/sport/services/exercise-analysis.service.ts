import { Injectable } from "@nestjs/common";
import { ExerciseRecordService, PlanExerciseService } from './';
import { extrapolate } from '@/common/utils';
import { PlanExercise, PlanExerciseDay } from "../entities";
import { ResponseAnalysisExerciseDto } from "../dto";

@Injectable()
export class ExerciseAnalysisService {
  constructor(
    private readonly exerciseRecordService: ExerciseRecordService,
  ) {}

  async calculateAnalysedSets (planDay: PlanExerciseDay,) {
    const arr = [];
    for (const planExercise of planDay.planExercises) {
      const pe = await this.calculateWeightForDay(planExercise);
      arr.push({planExerciseSet: pe});
    }
    return arr;
  }

  async calculateWeightForDay(
    planExercise: PlanExercise,
  ): Promise<ResponseAnalysisExerciseDto[]> {
    const limit = 16;
    const additionalWeight = 2.5;
    // Получаем записи упражнений, сгруппированные по дням
    const groupedRecords = await this.exerciseRecordService.getRecordsGroupedByDay(planExercise.exercise.id, limit);
    if( groupedRecords.length < 3) {
      const ret_arr = [];
      for (let i = 0; i < planExercise.sets; i++) {
        ret_arr.push({
          ...planExercise,
          weight: 0,
          exercise: planExercise.exercise.name,
        });
      }
    }
    // Для каждого дня суммируем веса
    const weightsPerDay = groupedRecords.map(group => {
      return group.reduce((sum, record) => sum + (record.weight * record.reps), 0);
    });

    // Определяем тренировочные дни
    const trainingDays = weightsPerDay.map((_, index) => index + 1);

    const currentTrainingIndex = groupedRecords.length + 1;

    // Интерполируем вес для текущего дня
    const extrapolatedWeight = await extrapolate(trainingDays, weightsPerDay, currentTrainingIndex);
    const predictedWeightForDay = extrapolatedWeight < weightsPerDay[weightsPerDay.length] ? weightsPerDay[weightsPerDay.length] : extrapolatedWeight; 

    // Рассчитываем тоннаж на основе предсказанного веса и количества подходов
    const totalWeight = predictedWeightForDay / 12.;
    const weightLimit = planExercise.sets * additionalWeight;
    const remainder = totalWeight % weightLimit;
    const baseWeight = totalWeight - remainder;
    const baseWeightPerSet = baseWeight / planExercise.sets;
    const additionalSets = Math.floor(remainder / additionalWeight);

    // Распределяем веса по подходам
    const result: ResponseAnalysisExerciseDto[] = [];
    for (let i = 0; i < planExercise.sets; i++) {
      if (i < additionalSets) {
        result.push({
          ...planExercise,
          weight: baseWeightPerSet + additionalWeight,
          exercise: planExercise.exercise.name,
        })
      } else {
        result.push({
          ...planExercise,
          weight: baseWeightPerSet,
          exercise: planExercise.exercise.name,
        })
      }
    }
    console.log(result);
    return result;
  }
}
