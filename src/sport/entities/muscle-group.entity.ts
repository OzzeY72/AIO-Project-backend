import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Unique } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';

@Entity('muscle_group')
export class MuscleGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => ExerciseEntity, (exercise) => exercise.muscleGroups)
  exercises: ExerciseEntity[];
}
