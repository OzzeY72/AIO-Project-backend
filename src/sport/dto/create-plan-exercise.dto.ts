import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanExerciseSetDto {
  @ApiProperty({ description: 'Weight' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'Number of repetitions per set' })
  @IsNumber()
  reps: number;

  @ApiProperty({ description: 'ID of exercise which own this set' })
  @IsNumber()
  plannedExerciseId: number;
}

export class CreatePlanExerciseDto {
  @ApiProperty({ description: 'Set of planexercise' })
  sets: CreatePlanExerciseSetDto[];

  @ApiProperty({ description: 'Name of the associated exercise' })
  @IsString()
  exercise: string;

  @ApiProperty({ description: 'ID of the associated plan day' })
  @IsNumber()
  planExerciseDayId: number;
}
