import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanExercise } from '../entities';
import { ExerciseService } from './exercise.service';
import { CreatePlanExerciseDto, UpdatePlanExerciseDto, ResponsePlanExerciseDto } from '../dto';
import { In } from 'typeorm';

@Injectable()
export class PlanExerciseService {
  constructor(
    @InjectRepository(PlanExercise)
    private readonly planExerciseRepository: Repository<PlanExercise>,
    private readonly exerciseService: ExerciseService, 
  ) {}

  async findAll(userId: string, options?: Partial<PlanExercise> | null): Promise<ResponsePlanExerciseDto[]> {
    const queryBuilder = this.planExerciseRepository.createQueryBuilder('planExercise')
      .where('planExercise.userId = :userId', { userId });

    if (options) {
      Object.keys(options).forEach(key => {
        queryBuilder.andWhere(`planExercise.${key} = :${key}`, { [key]: options[key] });
      });
    }

    queryBuilder
      .leftJoinAndSelect('planExercise.exercise', 'exercise');
      
    const result = await queryBuilder.getMany();
    return result.map(plan => this.toResponsePlanExercise(plan));
  }

  async findOne(id: number, userId: string): Promise<ResponsePlanExerciseDto> {
    const res = await this.planExerciseRepository.findOne({ where: { id, userId } });
    return this.toResponsePlanExercise(res);
  }

  async findByIds(ids: number[], userId: string): Promise<ResponsePlanExerciseDto[]> {
    const res = await this.planExerciseRepository.findBy({ 
      id: In(ids),
      userId
    });
    return res.map(plan => this.toResponsePlanExercise(plan));
  }
  
  async create(userId: string, createPlanExerciseDto: CreatePlanExerciseDto): Promise<ResponsePlanExerciseDto> {
    const { exerciseId, planExerciseDayId } = createPlanExerciseDto;
    const exercise = await this.exerciseService.findOne(exerciseId, userId);
    const planExercise = this.planExerciseRepository.create({
      ...createPlanExerciseDto,
      planExerciseDay: {id: planExerciseDayId},
      exercise,
      userId
    });

    const res = await this.planExerciseRepository.save(planExercise);
    return this.toResponsePlanExercise(res);
  }

  async update(id: number, userId: string, updatePlanExerciseDto: UpdatePlanExerciseDto): Promise<ResponsePlanExerciseDto> {
    const { exerciseId  } = updatePlanExerciseDto;
    await this.planExerciseRepository.update(id, {
      ...updatePlanExerciseDto,
      exercise: {id: exerciseId},
      userId 
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.planExerciseRepository.delete({id, userId});
  }

  toResponsePlanExercise(exerciseRecord: PlanExercise): ResponsePlanExerciseDto {
    return ({
      id: exerciseRecord.id,
      exercise: exerciseRecord.exercise.name,
      sets: exerciseRecord.sets,
      reps: exerciseRecord.reps,
      planExerciseDayId: exerciseRecord?.planExerciseDay?.id,
    });
  }
}
