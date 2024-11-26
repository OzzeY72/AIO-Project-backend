import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';
import { PlannedExerciseSet } from './plan-exercise-set.entity';
import { PlanExerciseDay } from './plan-exercise-day.entity';

@Entity('plan_exercise')
export class PlanExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @OneToMany(() => PlannedExerciseSet, (set) => set.plannedExercise, { cascade: true })
  sets: PlannedExerciseSet[];

  @ManyToOne(() => ExerciseEntity, (exercise) => exercise.planExercises)
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseEntity;

  @ManyToOne(() => PlanExerciseDay, (planExerciseDay) => planExerciseDay.planExercises)
  @JoinColumn({ name: 'planExerciseDayId' })
  planExerciseDay: PlanExerciseDay;
}


