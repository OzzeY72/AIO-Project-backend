import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseDay } from '../entities';
import { ExerciseRecordService } from './'; 
import { CreateExerciseDayDto, ResponseExerciseDay, UpdateExerciseDayDto } from '../dto';

@Injectable()
export class ExerciseDayService {
  constructor(
    @InjectRepository(ExerciseDay)
    private readonly exerciseDayRepository: Repository<ExerciseDay>,
    private readonly exerciseRecordService: ExerciseRecordService,
  ) {}

  async findAll(userId: string, options?: Partial<ExerciseDay> | null): Promise<ExerciseDay[]> {
    return options 
      ? await this.exerciseDayRepository.find({ relations: ['exerciseRecords', 'exerciseRecords.exercise'], where: {...options, userId} })
      : await this.exerciseDayRepository.find({ relations: ['exerciseRecords', 'exerciseRecords.exercise'], where: {userId} });
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
    const exerciseDay = this.exerciseDayRepository.create({
      ...createExerciseDayDto,
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
