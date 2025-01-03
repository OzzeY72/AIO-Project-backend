import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseEntity, MuscleGroupEntity } from '../entities';
import { CreateExerciseDto, UpdateExerciseDto } from '../dto';
import { MuscleGroupService } from './muscle-group.service';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
    private readonly muscleGroupService: MuscleGroupService,
  ) {}

  async findAll(userId: string, options?: Partial<ExerciseEntity> | null): Promise<ExerciseEntity[]> {
    return options 
      ? await this.exerciseRepository.find({where: {...options, userId}}) 
      : await this.exerciseRepository.find({where: {userId}});
  }

  async findOne(id: number, userId: string): Promise<ExerciseEntity> {
    return await this.exerciseRepository.findOne({ where: { id, userId } });
  }

  async findOneByName(exercise: string, userId: string) {
    return await this.exerciseRepository.findOne({where: {name: exercise, userId}});
  }

  async create(userId: string, createExerciseDto: CreateExerciseDto): Promise<ExerciseEntity> {
    const {name, muscleGroups} = createExerciseDto;

    var muscleGroupEntities = await Promise.all(muscleGroups.map(muscleGroup => 
      this.muscleGroupService.getOrCreateMuscleGroup(muscleGroup)
    ));

    const exercise = this.exerciseRepository.create({
      name,
      muscleGroups: muscleGroupEntities,
      userId
    });
    return await this.exerciseRepository.save(exercise);
  }

  async update(id: number, userId: string, updateExerciseDto: UpdateExerciseDto): Promise<ExerciseEntity> {
    const {name, muscleGroups} = updateExerciseDto;

    var muscleGroupEntities = await Promise.all(muscleGroups.map(muscleGroup => 
      this.muscleGroupService.getOrCreateMuscleGroup(muscleGroup)
    ));

    await this.exerciseRepository.update(id, {
      name,
      muscleGroups: muscleGroupEntities,
      userId
    });
    return await this.findOne(id, userId);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.exerciseRepository.delete({id, userId});
  }
}
