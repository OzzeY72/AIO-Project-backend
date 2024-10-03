import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRecordEntity } from '../entities';
import { CreateExerciseRecordDto, UpdateExerciseRecordDto } from '../dto';
import { groupBy } from '@/common/utils';

@Injectable()
export class ExerciseRecordService {
  constructor(
    @InjectRepository(ExerciseRecordEntity)
    private readonly exerciseRecordRepository: Repository<ExerciseRecordEntity>,
  ) {}

  async findAll(userId: string, options?: Partial<ExerciseRecordEntity> | null): Promise<ExerciseRecordEntity[]> {
    return options
      ? await this.exerciseRecordRepository.find({ relations: ['exercise'], where: {...options, userId}})
      : await this.exerciseRecordRepository.find({ relations: ['exercise'], where: {userId}})
  }

  async findOne(id: number, userId: string): Promise<ExerciseRecordEntity> {
    return await this.exerciseRecordRepository.findOne({ relations: ['exercise'], where: { id, userId } });
  }

  async getRecordsGroupedByDay(planExerciseId: number, limit: number): Promise<ExerciseRecordEntity[][]> {
    // Получаем записи упражнений по плану
    const records = await this.exerciseRecordRepository
      .createQueryBuilder('exercise_record')
      .innerJoinAndSelect('exercise_record.exerciseDay', 'exercise_day')
      .innerJoin('exercise_record.exercise', 'exercise')                
      .where('exercise.id = :planExerciseId', { planExerciseId })
      .orderBy('exercise_day.date', 'ASC')                    
      .limit(limit)                                           
      .getMany();

    // Группируем по дню выполнения (ExerciseDay)
    const groupedRecords = groupBy(records, record => record.exerciseDay.id);

    return groupedRecords;
  }

  async create(userId: string, createExerciseRecordDto: CreateExerciseRecordDto): Promise<ExerciseRecordEntity> {
    const { exerciseId, exerciseDayId } = createExerciseRecordDto;

    const exerciseRecord = this.exerciseRecordRepository.create({
      ...createExerciseRecordDto,
      exercise: { id: exerciseId },
      exerciseDay: { id: exerciseDayId },
      userId
    });

    return await this.exerciseRecordRepository.save(exerciseRecord);
  }

  async update(id: number, userId: string, updateExerciseRecordDto: UpdateExerciseRecordDto): Promise<ExerciseRecordEntity> {
    const { exerciseId, exerciseDayId, weight, reps } = updateExerciseRecordDto;

    await this.exerciseRecordRepository.update(id, {
      weight,
      reps,
      exercise: { id: exerciseId },
      exerciseDay: { id: exerciseDayId },
      userId
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.exerciseRecordRepository.delete({id, userId});
  }
}
