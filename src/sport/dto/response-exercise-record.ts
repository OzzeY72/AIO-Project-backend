import { ApiProperty } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';
import { ExerciseEntity } from '../entities';

export class ResponseExerciseRecordDto {
  @ApiProperty({ description: 'ID of ExerciseRecord' })
  id: number;

  @ApiProperty({ description: 'Exercise object' })
  exercise: ExerciseEntity;

  @ApiProperty({ description: 'Weight used in the exercise' })
  weight: number;

  @ApiProperty({ description: 'Number of repetitions' })
  reps: number;

  @ApiProperty({ description: 'ID of the associated exercise day' })
  exerciseDayId: number;
}
