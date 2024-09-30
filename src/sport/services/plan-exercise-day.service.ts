import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanExerciseDay } from '../entities';
import { PlanExerciseService } from './plan-exercise.service';
import { CreatePlanExerciseDayDto, UpdatePlanExerciseDayDto } from '../dto';

@Injectable()
export class PlanExerciseDayService {
  constructor(
    @InjectRepository(PlanExerciseDay)
    private readonly planExerciseDayRepository: Repository<PlanExerciseDay>,
    private planExerciseService: PlanExerciseService,
  ) {}

  async findAll(userId: string, options?: Partial<PlanExerciseDay> | null): Promise<PlanExerciseDay[]> {
    return options 
      ? await this.planExerciseDayRepository.find({ relations: ['planExercises'], where: {...options, userId}})
      : await this.planExerciseDayRepository.find({ relations: ['planExercises'], where: {userId}})
  }

  async findOne(id: number, userId: string): Promise<PlanExerciseDay> {
    return await this.planExerciseDayRepository.findOne({
      where: { id, userId },
      relations: ['planExercises'],
    });
  }

  async create(userId: string, createPlanExerciseDayDto: CreatePlanExerciseDayDto): Promise<PlanExerciseDay> {
    const planExerciseDay = this.planExerciseDayRepository.create({
      ...createPlanExerciseDayDto,
      userId
    });

    return await this.planExerciseDayRepository.save(planExerciseDay);
  }

  async update(id: number, userId: string, updatePlanExerciseDayDto: UpdatePlanExerciseDayDto): Promise<PlanExerciseDay> {
    await this.planExerciseDayRepository.update(id, {
      ...updatePlanExerciseDayDto,
      userId
    })
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.planExerciseDayRepository.delete({id, userId});
  }
}
