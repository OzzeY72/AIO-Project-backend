import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseRecordDto {
  @ApiProperty({ description: 'ID of the associated exercise' })
  @IsNumber()
  exerciseId: number;

  @ApiProperty({ description: 'Weight used in the exercise' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'Number of repetitions' })
  @IsNumber()
  reps: number;

  @ApiProperty({ description: 'ID of the associated exercise day' })
  @IsNumber()
  exerciseDayId: number;
}
