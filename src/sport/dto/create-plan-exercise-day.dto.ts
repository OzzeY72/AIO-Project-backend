import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanExerciseDayDto {
  @ApiProperty({ description: 'Name of day' })
  @IsString()
  weekDay: string;
}
