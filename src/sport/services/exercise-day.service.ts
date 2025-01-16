import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseDay } from '../entities';
import { ExerciseRecordService } from './'; 
import { CreateExerciseDayDto, ResponseExerciseDay, UpdateExerciseDayDto } from '../dto';
import { FindOptionsWhere, FindOperator } from 'typeorm';
import { toClearDate } from '@/common/utils';

@Injectable()
export class ExerciseDayService {
  constructor(
    @InjectRepository(ExerciseDay)
    private readonly exerciseDayRepository: Repository<ExerciseDay>,
    private readonly exerciseRecordService: ExerciseRecordService,
  ) {}

  async findAll(userId: string, options?: Partial<ExerciseDay> | null, date?: FindOperator<Date>, relations?: string[]): Promise<ExerciseDay[]> {
    const whereOptions: FindOptionsWhere<ExerciseDay> = options ? { ...options, date, userId } : { date, userId };

    return await this.exerciseDayRepository.find({
      relations: relations ?? ['exerciseRecords', 'exerciseRecords.exercise', 'exerciseRecords.exercise.muscleGroups'],
      where: whereOptions,
    });
  }

  async findDayByExerciseName(userId: string, exerciseName: string, date?: FindOperator<Date>, relations?: string[]): Promise<ExerciseDay[]> {
    const whereOptions: FindOptionsWhere<ExerciseDay> = { date, userId };

    return await this.exerciseDayRepository.find({
      relations: relations ?? ['exerciseRecords', 'exerciseRecords.exercise', 'exerciseRecords.exercise.muscleGroups'],
      where: {
        ...whereOptions,
        exerciseRecords: {
          exercise: {
            name: exerciseName,
          },
        }
      },
    });
  }

  async findOne(id: number, userId: string): Promise<ExerciseDay> {
    return await this.exerciseDayRepository.findOne({
      where: { id, userId },
      relations: ['exerciseRecords', 'exerciseRecords.exercise'],
    });
  }

  async findOneByDate(date: Date, userId: string): Promise<ExerciseDay> {
    return await this.exerciseDayRepository.findOne({
      where: { date, userId },
      relations: ['exerciseRecords', 'exerciseRecords.exercise'],
    });
  }

  async create(userId: string, createExerciseDayDto: CreateExerciseDayDto): Promise<ExerciseDay> {
    const date = toClearDate(createExerciseDayDto.date);

    const existExerciseDay = await this.findOneByDate(date, userId);
    if(existExerciseDay) return existExerciseDay;

    const exerciseDay = this.exerciseDayRepository.create({
      ...createExerciseDayDto,
      date: toClearDate(createExerciseDayDto.date),
      userId
    });
    return await this.exerciseDayRepository.save(exerciseDay);
  }

  async update(id: number, userId: string, updateExerciseDayDto: UpdateExerciseDayDto): Promise<ExerciseDay> {
    await this.exerciseDayRepository.update(id, {
      ...updateExerciseDayDto,
      userId,
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.exerciseDayRepository.delete({
      id,
      userId,
    });
  }

  toResponseExerciseDayDto(exerciseDay: ExerciseDay): ResponseExerciseDay {
    return ({
      ...exerciseDay,
      exerciseRecords: exerciseDay.exerciseRecords.map((record) => this.exerciseRecordService.toResponseExerciseRecord(record))
    });
  } 
}
