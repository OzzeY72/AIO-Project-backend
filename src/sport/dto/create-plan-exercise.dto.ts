import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanExerciseDto {
  @ApiProperty({ description: 'ID of the associated exercise' })
  @IsNumber()
  exerciseId: number;

  @ApiProperty({ description: 'Number of sets to perform' })
  @IsNumber()
  sets: number;

  @ApiProperty({ description: 'Number of repetitions per set' })
  @IsNumber()
  reps: number;

  @ApiProperty({ description: 'ID of the associated plan day' })
  @IsNumber()
  planExerciseDayId: number;
}
