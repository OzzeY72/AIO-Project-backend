import { IsDate, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlanExerciseDto } from './create-plan-exercise.dto';

export class CreateExerciseDayDto {
  @ApiProperty({ description: 'Date of the exercise day' })
  @IsDate()
  date: Date;

  @ApiProperty({ type: [CreatePlanExerciseDto], description: 'List of planned exercises for the day' })
  @IsArray()
  planExercises: CreatePlanExerciseDto[];
}
