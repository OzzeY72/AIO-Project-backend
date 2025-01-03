import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique, ManyToMany, JoinTable } from 'typeorm';
import { MuscleGroupEntity } from './muscle-group.entity';
import { ExerciseRecordEntity } from './exercise-record.entity';
import { PlanExercise } from './plan-exercise.entity';

@Entity('exercise')
@Unique(['name'])
export class ExerciseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @ManyToMany(() => MuscleGroupEntity, (muscleGroup) => muscleGroup.exercises, { cascade: true })
  @JoinTable({
    name: 'exercise_muscle_groups',
    joinColumn: { name: 'exercise_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'muscle_group_id', referencedColumnName: 'id' },
  })
  muscleGroups: MuscleGroupEntity[];

  @OneToMany(() => ExerciseRecordEntity, (record) => record.exercise)
  exerciseRecords: ExerciseRecordEntity[];

  @OneToMany(() => PlanExercise, (planExercise) => planExercise.exercise)
  planExercises: PlanExercise[];
}
