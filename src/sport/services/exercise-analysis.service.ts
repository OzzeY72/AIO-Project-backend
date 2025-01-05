import { Injectable } from "@nestjs/common";
import { ExerciseRecordService, ExerciseDayService, ExerciseService } from './';
import { Between } from 'typeorm';
import { RequestPeriod, ResponseExercisePopularity } from "../dto";
import { ResponseRepsByGroup, RequestDayTonnage } from "../dto";
import { convertToDays } from "@/common/utils";
//import { ResponseAnalysisExerciseDto } from "../dto";

@Injectable()
export class ExerciseAnalysisService {
  constructor(
    private readonly exerciseRecordService: ExerciseRecordService,
    private readonly exerciseDayService: ExerciseDayService,
    private readonly exerciseService: ExerciseService,
  ) {}

  async exercisePopularityGraphic(userId: string, requestPeriod: RequestPeriod): Promise<ResponseExercisePopularity>{
    const {period} = requestPeriod;

    const startDate = convertToDays(period);
    
    const exerciseDays = await this.exerciseDayService.findAll(userId, 
      undefined,
      Between(startDate, new Date()),
      ['exerciseRecords', 'exerciseRecords.exercise']
    );
    const exerciseReps = exerciseDays.reduce((exerciseRepsMap, exerciseDay) => {
      exerciseDay.exerciseRecords.forEach(exerciseRecord => {
        const exercise = exerciseRecord.exercise.name;
        exerciseRepsMap.set(exercise, (exerciseRepsMap.get(exercise) || 0) + 1);
      });
      return exerciseRepsMap;
    }, new Map());

    const response = [];

    for(const [key, value] of exerciseReps.entries()){
      const exercise = key;
      response.push({ exercise, reps: value });      
    }

    return {pairs: response};
  }

  async repsByGroup(userId: string, requestPeriod: RequestPeriod): Promise<ResponseRepsByGroup> {
    const {period} = requestPeriod;
    const startDate = convertToDays(period);
    
    const exerciseDays = await this.exerciseDayService.findAll(userId, undefined, Between(startDate, new Date()));

    const exerciseReps = exerciseDays.reduce((repsToGroup, exerciseDay) => {
      exerciseDay.exerciseRecords.forEach(exerciseRecord => {
        exerciseRecord.exercise.muscleGroups.forEach(muscleGroup => {
          const index = muscleGroup.name;
          repsToGroup.set(index, (repsToGroup.get(index) || 0) + 1);
        });
      });
      return repsToGroup;
    }, new Map());

    const response = [];

    for(const [key, value] of exerciseReps.entries()){
      console.log(`Key: ${key} - Value:${value}`);
      const muscleGroup = key;
      response.push({ muscleGroup, reps: value });      
    }

    return {pairs: response};
  }

  async dayTonnage(userId: string, requestDayTonnage: RequestDayTonnage): Promise<ResponseRepsByGroup> {
    const {period, exercise: exerciseName } = requestDayTonnage;
    const startDate = convertToDays(period);
    
    const exerciseDays = await this.exerciseDayService.findDayByExerciseName(
      userId,
      exerciseName, 
      Between(startDate, new Date()),
      ['exerciseRecords', 'exerciseRecords.exercise']
    );

    const dayTonnage = exerciseDays.reduce((dayTonnage, exerciseDay) => {
      exerciseDay.exerciseRecords.forEach(exerciseRecord => {
        const index = exerciseDay.date;
        dayTonnage.set(index, (dayTonnage.get(index) || 0) + exerciseRecord.reps * exerciseRecord.weight)
      });
      return dayTonnage;
    }, new Map());

    const response = [];

    for(const [key, value] of dayTonnage.entries()){
      console.log(`Key: ${key} - Value:${value}`);
      response.push({ date: key, tonnage: value });      
    }

    return {pairs: response};
  }
  


  /*
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
  }*/
}
