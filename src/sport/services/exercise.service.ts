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
      ? await this.exerciseRepository.find({where: {...options, userId},relations: ['muscleGroups']}) 
      : await this.exerciseRepository.find({where: {userId},relations: ['muscleGroups']});
  }

  async findOne(id: number, userId: string): Promise<ExerciseEntity> {
    return await this.exerciseRepository.findOne({ where: { id, userId }, relations: ['muscleGroups'] });
  }

  async findOneByName(exercise: string, userId: string) {
    return await this.exerciseRepository.findOne({where: {name: exercise, userId}, relations: ['muscleGroups']});
  }

  async create(userId: string, createExerciseDto: CreateExerciseDto): Promise<ExerciseEntity> {
    const {name, muscleGroups} = createExerciseDto;

    var muscleGroupEntities = await Promise.all(muscleGroups.map(async (muscleGroup) => {
      const res = await this.muscleGroupService.findOneByName(muscleGroup); // Ждем результата
      return res !== null ? res : await this.muscleGroupService.create({ name: muscleGroup }); // Создаем, если не найдено
    }));
    

    const exercise = this.exerciseRepository.create({
      name,
      muscleGroups: muscleGroupEntities,
      userId
    });

    exercise.muscleGroups = muscleGroupEntities;
    return await this.exerciseRepository.save(exercise);
  }

  async update(id: number, userId: string, updateExerciseDto: UpdateExerciseDto): Promise<ExerciseEntity> {
    const {name, muscleGroups} = updateExerciseDto;

    var muscleGroupEntities = await Promise.all(muscleGroups.map(muscleGroup => 
      this.muscleGroupService.findOneByName(muscleGroup)
    ));

    const exercise = await this.exerciseRepository.findOne({
      where: { id, userId },
      relations: ['muscleGroups'],
    });

    if (!exercise) {
      throw new Error(`Exercise with ID ${id} not found for user ${userId}`);
    }

    exercise.name = name;
    exercise.muscleGroups = muscleGroupEntities;

    return await this.exerciseRepository.save(exercise);
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.exerciseRepository.delete({id, userId});
  }
}
