import { ApiProperty } from '@nestjs/swagger';

export class ResponseExerciseRecordDto {
  @ApiProperty({ description: 'ID of ExerciseRecord' })
  id: number;

  @ApiProperty({ description: 'Exercise name' })
  exercise: string;

  @ApiProperty({ description: 'Weight used in the exercise' })
  weight: number;

  @ApiProperty({ description: 'Number of repetitions' })
  reps: number;

  @ApiProperty({ description: 'ID of the associated exercise day' })
  exerciseDayId: number;
}
