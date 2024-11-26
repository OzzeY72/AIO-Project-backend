import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanExercise, PlannedExerciseSet } from '../entities';
import { ExerciseService } from './exercise.service';
import { CreatePlanExerciseDto, UpdatePlanExerciseDto, ResponsePlanExerciseDto } from '../dto';
import { In } from 'typeorm';
import { PlanExerciseSetService } from './plan-exercise-set.service';

@Injectable()
export class PlanExerciseService {
  constructor(
    @InjectRepository(PlanExercise)
    private readonly planExerciseRepository: Repository<PlanExercise>,
    @InjectRepository(PlannedExerciseSet)
    private readonly planExerciseSetRepository: Repository<PlannedExerciseSet>,
    private readonly exerciseService: ExerciseService, 
    private readonly planExerciseSetService: PlanExerciseSetService,
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
      .leftJoinAndSelect('planExercise.exercise', 'exercise')
      .leftJoinAndSelect('planExercise.sets', 'sets');
      
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
    const { exercise: exerciseName, planExerciseDayId, sets } = createPlanExerciseDto;
    const exercise = await this.exerciseService.findOneByName(exerciseName, userId);

    const planExercise = this.planExerciseRepository.create({
      planExerciseDay: {id: planExerciseDayId},
      exercise,
      userId
    });

    const savedPlanExercise = await this.planExerciseRepository.save(planExercise);

    const createdSets = await Promise.all(
      sets.map(async (set) => 
        this.planExerciseSetRepository.create({
          plannedExercise: savedPlanExercise,
          weight: set.weight,
          reps: set.reps,
          userId
        }),
      )
    );
    const savedSets = await Promise.all(
      createdSets.map((set) => this.planExerciseSetRepository.save(set))
    );
    savedPlanExercise.sets = savedSets;

    const finalPlanExercise = await this.planExerciseRepository.save(savedPlanExercise);
    return this.toResponsePlanExercise(finalPlanExercise);
  }

  // async update(id: number, userId: string, updatePlanExerciseDto: UpdatePlanExerciseDto): Promise<ResponsePlanExerciseDto> {
  //   const { exerciseId  } = updatePlanExerciseDto;
  //   await this.planExerciseRepository.update(id, {
  //     ...updatePlanExerciseDto,
  //     exercise: {id: exerciseId},
  //     userId 
  //   });
  //   return await this.findOne(id, userId);
  // }

  async update(id: number, userId: string, updatePlanExerciseDto: UpdatePlanExerciseDto): Promise<ResponsePlanExerciseDto> {
    const { exercise: exerciseName, sets } = updatePlanExerciseDto;

    const currentPlanExercise = await this.planExerciseRepository.findOne({
      where: { id, userId },
      relations: ['sets'],
    });

    const currentSetIds = currentPlanExercise.sets.map((set) => set.id);
    const updatedSetIds = sets.map((set) => set.id).filter((id) => id);
    const setsToDelete = currentSetIds.filter((id) => !updatedSetIds.includes(id));

    if (setsToDelete.length > 0) {
      await this.planExerciseSetRepository.delete(setsToDelete);
    }

    for (const set of sets) {
      if (set.id) {
        await this.planExerciseSetRepository.update(set.id, {
          ...set,
        });
      }
    }
  
    const newSets = sets.filter((set) => !currentSetIds.includes(set.id));
    for (const newSet of newSets) {
      const plannedExerciseSet = this.planExerciseSetRepository.create({
        ...newSet,
        id: null,
        plannedExercise: { id },
        userId
      });
      await this.planExerciseSetRepository.save(plannedExerciseSet);
    }

    const exercise = await this.exerciseService.findOneByName(exerciseName, userId);
    await this.planExerciseRepository.update(id, {
      exercise: exercise,
      userId,
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.planExerciseRepository.delete({id, userId});
  }

  toResponsePlanExercise(exerciseRecord: PlanExercise): ResponsePlanExerciseDto {
    return ({
      id: exerciseRecord.id,
      exercise: exerciseRecord.exercise?.name,
      sets: exerciseRecord?.sets?.map(x => this.planExerciseSetService.toResponsePlanExerciseSet(x)),
      planExerciseDayId: exerciseRecord?.planExerciseDay?.id
    });
  }
}
