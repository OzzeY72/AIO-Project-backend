import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanExerciseDayDto {
  @ApiProperty({ description: 'Day of the week (0-6)' })
  @IsNumber()
  weekDay: number;
}
