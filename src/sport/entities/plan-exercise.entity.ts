import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';
import { PlanExerciseDay } from './plan-exercise-day.entity';

@Entity('plan_exercise')
export class PlanExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @ManyToOne(() => ExerciseEntity, (exercise) => exercise.planExercises)
  exercise: ExerciseEntity;

  @ManyToOne(() => PlanExerciseDay, (planDay) => planDay.planExercises)
  planExerciseDay: PlanExerciseDay;

  @Column({ type: 'int' })
  sets: number;

  @Column({ type: 'int' })
  reps: number;
}
