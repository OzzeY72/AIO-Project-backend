import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseDay } from '../entities';
import { CreateExerciseDayDto, UpdateExerciseDayDto } from '../dto';

@Injectable()
export class ExerciseDayService {
  constructor(
    @InjectRepository(ExerciseDay)
    private readonly exerciseDayRepository: Repository<ExerciseDay>,
  ) {}

  async findAll(options?: Partial<ExerciseDay> | null): Promise<ExerciseDay[]> {
    return options 
      ? await this.exerciseDayRepository.find({ relations: ['planExercise'], where: options })
      : await this.exerciseDayRepository.find({ relations: ['planExercise'] });
  }

  async findOne(id: number): Promise<ExerciseDay> {
    return await this.exerciseDayRepository.findOne({
      where: { id },
      relations: ['planExercise'],
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
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.exerciseDayRepository.delete(id);
  }
}
