import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuscleGroupEntity } from '../entities';
import { CreateMuscleGroupDto } from '../dto';
import { UpdateMuscleGroupDto } from '../dto';

@Injectable()
export class MuscleGroupService {
  constructor(
    @InjectRepository(MuscleGroupEntity)
    private readonly muscleGroupRepository: Repository<MuscleGroupEntity>,
  ) {}

  // Получить все группы мышц
  async findAll(): Promise<MuscleGroupEntity[]> {
    return await this.muscleGroupRepository.find();
  }

  // Найти группу мышц по ID
  async findOne(id: number): Promise<MuscleGroupEntity> {
    return await this.muscleGroupRepository.findOne({ where: { id }});
  }

  // Найти группу мышц по имени
   async findOneByName (name: string): Promise<MuscleGroupEntity> {
      const query = this.muscleGroupRepository.createQueryBuilder('muscleGroups')
          .where('muscleGroups.name = :name', { name: name });

      const result = await query.getOne();
      console.log(result);
      return result;
  }
  // Создать новую группу мышц
  async create(createMuscleGroupDto: CreateMuscleGroupDto): Promise<MuscleGroupEntity> {
    const muscleGroup = this.muscleGroupRepository.create(createMuscleGroupDto);
    console.log("SUKA BLYAT CREATE")
    return await this.muscleGroupRepository.save(muscleGroup);
  }

  // Обновить группу мышц
  async update(id: number, updateMuscleGroupDto: UpdateMuscleGroupDto): Promise<MuscleGroupEntity> {
    await this.muscleGroupRepository.update(id, updateMuscleGroupDto);
    return await this.findOne(id);
  }

  // Удалить группу мышц
  async delete(id: number): Promise<void> {
    await this.muscleGroupRepository.delete(id);
  }
}
