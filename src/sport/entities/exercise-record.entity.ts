import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';
import { ExerciseDay } from './exercise-day.entity';

@Entity('exercise_record')
export class ExerciseRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExerciseEntity, (exercise) => exercise.exerciseRecords,  { onDelete: 'CASCADE' })
  exercise: ExerciseEntity;

  @ManyToOne(() => ExerciseDay, (exerciseDay) => exerciseDay.exerciseRecords, { onDelete: 'CASCADE' })
  exerciseDay: ExerciseDay;

  @Column('decimal', { precision: 6, scale: 2 , nullable: false})
  weight: number;

  @Column({ type: 'int' })
  reps: number;
  
  @Column({ type: 'varchar', length: 255 })
  userId: string;
}
