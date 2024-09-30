import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanExercise } from '../entities';
import { CreatePlanExerciseDto, UpdatePlanExerciseDto } from '../dto';
import { In } from 'typeorm';

@Injectable()
export class PlanExerciseService {
  constructor(
    @InjectRepository(PlanExercise)
    private readonly planExerciseRepository: Repository<PlanExercise>,
  ) {}

  async findAll(userId: string, options?: Partial<PlanExercise> | null): Promise<PlanExercise[]> {
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
    return result;
  }

  async findOne(id: number, userId: string): Promise<PlanExercise> {
    return await this.planExerciseRepository.findOne({ where: { id, userId } });
  }

  async findByIds(ids: number[], userId: string): Promise<PlanExercise[]> {
    return await this.planExerciseRepository.findBy({ 
      id: In(ids),
      userId
    });
  }
  
  async create(userId: string, createPlanExerciseDto: CreatePlanExerciseDto): Promise<PlanExercise> {
    const { exerciseId } = createPlanExerciseDto;

    const planExercise = this.planExerciseRepository.create({
      ...createPlanExerciseDto,
      exercise: { id: exerciseId },
      userId
    });

    return await this.planExerciseRepository.save(planExercise);
  }

  async update(id: number, userId: string, updatePlanExerciseDto: UpdatePlanExerciseDto): Promise<PlanExercise> {
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
}
