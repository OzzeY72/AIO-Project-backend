import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {PlannedExerciseSet } from '../entities';
import { ResponsePlanExerciseSetDto, CreatePlanExerciseSetDto, UpdatePlanExerciseSetDto } from '../dto';
import { In } from 'typeorm';

@Injectable()
export class PlanExerciseSetService {
  constructor(
    @InjectRepository(PlannedExerciseSet)
    private readonly planExerciseSetRepository: Repository<PlannedExerciseSet>,
  ) {}

  async findAll(userId: string, options?: Partial<PlannedExerciseSet> | null): Promise<ResponsePlanExerciseSetDto[]> {
    const res = options 
        ? await this.planExerciseSetRepository.find({where: {...options, userId}}) 
        : await this.planExerciseSetRepository.find({where: {userId}});

    return res.map(set => this.toResponsePlanExerciseSet(set));
    //return res;
  }

  async findOne(id: number, userId: string): Promise<ResponsePlanExerciseSetDto> {
    const res = await this.planExerciseSetRepository.findOne({ where: { id, userId } });
    return this.toResponsePlanExerciseSet(res);
  }

  async findByIds(ids: number[], userId: string): Promise<ResponsePlanExerciseSetDto[]> {
    const res = await this.planExerciseSetRepository.findBy({ 
      id: In(ids),
      userId
    });
    return res.map(plan => this.toResponsePlanExerciseSet(plan));
  }
  
  async create(userId: string, createPlanExerciseDto: CreatePlanExerciseSetDto): Promise<ResponsePlanExerciseSetDto> {
    console.log(createPlanExerciseDto);
    const planExercise = this.planExerciseSetRepository.create({
      ...createPlanExerciseDto,
      userId
    });

    const res = await this.planExerciseSetRepository.save(planExercise);
    return this.toResponsePlanExerciseSet(res);
  }

  async update(id: number, userId: string, updatePlanExerciseSetDto: UpdatePlanExerciseSetDto): Promise<ResponsePlanExerciseSetDto> {
    await this.planExerciseSetRepository.update(id, {
      ...updatePlanExerciseSetDto,
      userId 
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.planExerciseSetRepository.delete({id, userId});
  }

  toResponsePlanExerciseSet(set: PlannedExerciseSet): ResponsePlanExerciseSetDto {
    return ({
      id: set.id,
      weight: set.weight,
      reps: set.reps,
    });
  }
}
