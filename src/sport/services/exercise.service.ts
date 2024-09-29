import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseEntity } from '../entities';
import { CreateExerciseDto, UpdateExerciseDto } from '../dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
  ) {}

  async findAll(options?: Partial<ExerciseEntity> | null): Promise<ExerciseEntity[]> {
    return options ? await this.exerciseRepository.find({where: options}) : await this.exerciseRepository.find();
  }

  async findOne(id: number, userId: string): Promise<ExerciseEntity> {
    return await this.exerciseRepository.findOne({ where: { id, userId } });
  }

  async create(userId: string, createExerciseDto: CreateExerciseDto): Promise<ExerciseEntity> {
    const exercise = this.exerciseRepository.create({
      ...createExerciseDto,
      userId
    });
    return await this.exerciseRepository.save(exercise);
  }

  async update(id: number, userId: string, updateExerciseDto: UpdateExerciseDto): Promise<ExerciseEntity> {
    await this.exerciseRepository.update(id, {
      ...updateExerciseDto,
      userId
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number): Promise<void> {
    await this.exerciseRepository.delete(id);
  }
}
