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

  async findAll(options?: Partial<ExerciseRecordEntity> | null): Promise<ExerciseRecordEntity[]> {
    return options
      ? await this.exerciseRecordRepository.find({ where: options })
      : await this.exerciseRecordRepository.find()
  }

  async findOne(id: number): Promise<ExerciseRecordEntity> {
    return await this.exerciseRecordRepository.findOne({ where: { id } });
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
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.exerciseRecordRepository.delete(id);
  }
}
