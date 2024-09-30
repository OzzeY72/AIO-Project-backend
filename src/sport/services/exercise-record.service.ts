import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRecordEntity } from '../entities';
import { CreateExerciseRecordDto, UpdateExerciseRecordDto } from '../dto';

@Injectable()
export class ExerciseRecordService {
  constructor(
    @InjectRepository(ExerciseRecordEntity)
    private readonly exerciseRecordRepository: Repository<ExerciseRecordEntity>,
  ) {}

  async findAll(userId: string, options?: Partial<ExerciseRecordEntity> | null): Promise<ExerciseRecordEntity[]> {
    return options
      ? await this.exerciseRecordRepository.find({where: {...options, userId}})
      : await this.exerciseRecordRepository.find({where: {userId}})
  }

  async findOne(id: number, userId: string): Promise<ExerciseRecordEntity> {
    return await this.exerciseRecordRepository.findOne({ where: { id, userId } });
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
    const { exerciseId, exerciseDayId } = updateExerciseRecordDto;

    await this.exerciseRecordRepository.update(id, {
      ...updateExerciseRecordDto,
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
