import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ExerciseRecordEntity } from './exercise-record.entity';
import { PlanExercise } from './plan-exercise.entity';

@Entity('exercise')
@Unique(['id', 'name'])
export class ExerciseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @OneToMany(() => ExerciseRecordEntity, (record) => record.exercise)
  exerciseRecords: ExerciseRecordEntity[];

  @OneToMany(() => PlanExercise, (planExercise) => planExercise.exercise)
  planExercises: PlanExercise[];
}
