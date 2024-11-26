import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PlanExercise } from './plan-exercise.entity';

@Entity('plan_exercise_set')
export class PlannedExerciseSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PlanExercise, (exercise) => exercise.sets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planned_exercise_id' })
  plannedExercise: PlanExercise;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'int' })
  reps: number;

  @Column({ type: 'varchar', length: 255 })
  userId: string;
}