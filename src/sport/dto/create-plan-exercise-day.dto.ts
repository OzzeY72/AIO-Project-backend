import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlanExerciseDto } from './create-plan-exercise.dto';

export class CreatePlanExerciseDayDto {
  @ApiProperty({ description: 'Day of the week (0-6)' })
  @IsNumber()
  weekDay: number;

  @ApiProperty({ type: [CreatePlanExerciseDto], description: 'List of plan exercises' })
  planExercises: CreatePlanExerciseDto[];
}
