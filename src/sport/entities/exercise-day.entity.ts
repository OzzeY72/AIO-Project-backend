import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { ExerciseRecordEntity } from './exercise-record.entity';

@Entity('exercise_day')
@Unique(['date'])
export class ExerciseDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @OneToMany(() => ExerciseRecordEntity, (record) => record.exerciseDay)
  exerciseRecords: ExerciseRecordEntity[];

  @Column({ type: 'varchar', length: 255 })
  userId: string;
}
