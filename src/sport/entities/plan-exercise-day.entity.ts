import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { PlanExercise } from './plan-exercise.entity';

@Entity('plan_exercise_day')
@Unique(['weekDay'])
export class PlanExerciseDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column()
  weekDay: string;

  @OneToMany(() => PlanExercise, (planExercise) => planExercise.planExerciseDay)
  planExercises: PlanExercise[];
}
