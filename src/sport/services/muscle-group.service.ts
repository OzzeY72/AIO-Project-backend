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

  async getOrCreateMuscleGroup(name: string): Promise<MuscleGroupEntity> {
    // Попробуем найти группу мышц по имени
    let muscleGroup = await this.findOneByName(name);
  
    // Если группы не существует, создаём новую
    if (!muscleGroup) {
      muscleGroup = await this.create({ name });
    }
  
    return muscleGroup;
  }

  // Получить все группы мышц
  async findAll(): Promise<MuscleGroupEntity[]> {
    return await this.muscleGroupRepository.find();
  }

  // Найти группу мышц по ID
  async findOne(id: number): Promise<MuscleGroupEntity> {
    return await this.muscleGroupRepository.findOne({ where: { id } });
  }

  // Найти группу мышц по имени
  async findOneByName(name: string): Promise<MuscleGroupEntity> {
    return await this.muscleGroupRepository.findOne({ where: { name } });
  }

  // Создать новую группу мышц
  async create(createMuscleGroupDto: CreateMuscleGroupDto): Promise<MuscleGroupEntity> {
    const muscleGroup = this.muscleGroupRepository.create(createMuscleGroupDto);
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
