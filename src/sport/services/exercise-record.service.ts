import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRecordEntity } from '../entities';
import { CreateExerciseRecordDto, ResponseExerciseRecordDto, UpdateExerciseRecordDto, RequestExerciseRecordDto } from '../dto';
import { groupBy } from '@/common/utils';
import { ExerciseService } from './exercise.service';

@Injectable()
export class ExerciseRecordService {
  constructor(
    @InjectRepository(ExerciseRecordEntity)
    private readonly exerciseRecordRepository: Repository<ExerciseRecordEntity>,
    private readonly exerciseService: ExerciseService,
  ) {}

  async findAll(userId: string, options?: Partial<RequestExerciseRecordDto> | null): Promise<ResponseExerciseRecordDto[]> {
    const res = options
      ? await this.exerciseRecordRepository.find({ relations: ['exercise'], where: {...options, userId}})
      : await this.exerciseRecordRepository.find({ relations: ['exercise'], where: {userId}});
    return res.map(record => this.toResponseExerciseRecord(record));
  }

  async findOne(id: number, userId: string): Promise<ResponseExerciseRecordDto> {
    const res = await this.exerciseRecordRepository.findOne({ relations: ['exercise'], where: { id, userId } });
    return this.toResponseExerciseRecord(res);
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

  async create(userId: string, createExerciseRecordDto: CreateExerciseRecordDto): Promise<ResponseExerciseRecordDto> {
    const { exercise, exerciseDayId } = createExerciseRecordDto;
    const exerciseEntity = await this.exerciseService.findOneByName(exercise, userId);

    const exerciseRecord = this.exerciseRecordRepository.create({
      ...createExerciseRecordDto,
      exercise: exerciseEntity,
      exerciseDay: { id: exerciseDayId },
      userId
    });
    console.log(exerciseRecord);
    const res = await this.exerciseRecordRepository.save(exerciseRecord);
    return this.toResponseExerciseRecord(res);
  }

  async update(id: number, userId: string, updateExerciseRecordDto: UpdateExerciseRecordDto): Promise<ResponseExerciseRecordDto> {
    const { exercise: exerciseName, exerciseDayId, weight, reps } = updateExerciseRecordDto;

    const exercise = await this.exerciseService.findOneByName(exerciseName, userId);
    await this.exerciseRecordRepository.update(id, {
      weight,
      reps,
      exercise: exercise,
      //exerciseDay: { id: exerciseDayId },
      userId
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.exerciseRecordRepository.delete({id, userId});
  }

  toResponseExerciseRecord(exerciseRecord: ExerciseRecordEntity): ResponseExerciseRecordDto {
    return ({
      ...exerciseRecord,
      exercise: exerciseRecord.exercise.name,
      exerciseDayId: exerciseRecord?.exerciseDay?.id,
    });
  }
}
