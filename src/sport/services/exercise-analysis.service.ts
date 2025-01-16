import { Injectable } from "@nestjs/common";
import { ExerciseRecordService, ExerciseDayService, ExerciseService } from './';
import { Between } from 'typeorm';
import { RequestPeriod, ResponseExercisePopularity } from "../dto";
import { ResponseRepsByGroup, RequestDayTonnage, RequestDayMaxWeightOnReps } from "../dto";
import { ResponseDayTonnage, ResponseDayMaxWeight } from "../dto";
import { convertToDays, toClearDate } from "@/common/utils";
//import { ResponseAnalysisExerciseDto } from "../dto";

@Injectable()
export class ExerciseAnalysisService {
  constructor(
    private readonly exerciseRecordService: ExerciseRecordService,
    private readonly exerciseDayService: ExerciseDayService,
    private readonly exerciseService: ExerciseService,
  ) {}

  sortExerciseDays(exerciseDays){
    return exerciseDays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async exercisePopularityGraphic(userId: string, requestPeriod: RequestPeriod): Promise<ResponseExercisePopularity>{
    const {start, end} = requestPeriod;

    const endDate = end ? end : new Date();

    const exerciseDays = await this.exerciseDayService.findAll(userId, 
      undefined,
      Between(toClearDate(start), toClearDate(endDate)),
      ['exerciseRecords', 'exerciseRecords.exercise']
    );
    const sortExerciseDays = this.sortExerciseDays(exerciseDays);
    const exerciseReps = sortExerciseDays?.reduce((exerciseRepsMap, exerciseDay) => {
      exerciseDay.exerciseRecords.forEach(exerciseRecord => {
        const exercise = exerciseRecord?.exercise?.name;
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
    const {start, end} = requestPeriod;

    const endDate = end ? end : new Date();
    
    const exerciseDays = await this.exerciseDayService.findAll(userId, undefined, Between(start, endDate));
    const sortExerciseDays = this.sortExerciseDays(exerciseDays);

    const exerciseReps = sortExerciseDays.reduce((repsToGroup, exerciseDay) => {
      exerciseDay.exerciseRecords.forEach(exerciseRecord => {
        exerciseRecord.exercise?.muscleGroups?.forEach(muscleGroup => {
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

  async dayTonnage(userId: string, requestDayTonnage: RequestDayTonnage): Promise<ResponseDayTonnage> {
    const {start, end, exercise: exerciseName } = requestDayTonnage;

    const endDate = end ? end : new Date();
    
    const exerciseDays = await this.exerciseDayService.findDayByExerciseName(
      userId,
      exerciseName, 
      Between(toClearDate(start), toClearDate(endDate)),
      ['exerciseRecords', 'exerciseRecords.exercise']
    );
    const sortExerciseDays = this.sortExerciseDays(exerciseDays);

    const dayTonnage = sortExerciseDays.reduce((dayTonnage, exerciseDay) => {
      exerciseDay.exerciseRecords.forEach(exerciseRecord => {
        const index = exerciseDay.date;
        dayTonnage.set(index, (dayTonnage.get(index) || 0) + exerciseRecord.reps * exerciseRecord.weight)
      });
      return dayTonnage;
    }, new Map());

    const response = [];

    for(const [key, value] of dayTonnage.entries()){
      //console.log(`Key: ${key} - Value:${value}`);
      response.push({ date: key, tonnage: value });      
    }

    return {pairs: response};
  }
  async dayMaxWeightOnReps(userId: string, requestdayMaxWeightOnReps: RequestDayMaxWeightOnReps): Promise<ResponseDayMaxWeight> {
    const {start, end, exercise: exerciseName, reps } = requestdayMaxWeightOnReps;

    const endDate = end ? end : new Date();
    const minReps = reps ? reps : 8;
    
    const exerciseDays = await this.exerciseDayService.findDayByExerciseName(
      userId,
      exerciseName, 
      Between(toClearDate(start), toClearDate(endDate)),
      ['exerciseRecords', 'exerciseRecords.exercise']
    );
    const sortExerciseDays = this.sortExerciseDays(exerciseDays);

    const dayTonnage = sortExerciseDays.reduce((maxWeight, exerciseDay) => {
      exerciseDay.exerciseRecords.forEach(exerciseRecord => {
        const index = exerciseDay.date;
        maxWeight.set(index, Math.max((maxWeight.get(index) || 0), exerciseRecord.reps >= minReps ? exerciseRecord.weight : 0))
      });
      
      return new Map(
        [...maxWeight].filter(([key, value]) => value != 0)
      );;
    }, new Map());

    const response = [];

    for(const [key, value] of dayTonnage.entries()){
      //console.log(`Key: ${key} - Value:${value}`);
      response.push({ date: key, maxWeight: value });      
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
