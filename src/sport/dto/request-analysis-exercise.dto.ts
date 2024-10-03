import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestAnalysisExerciseDto {
  @ApiProperty({ description: 'Week day of plan exercise day', type: Number })
  @IsNumber()
  weekDay: number;
}
