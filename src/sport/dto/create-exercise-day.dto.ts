import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDayDto {
  @ApiProperty({ description: 'Date of the exercise day' })
  @IsDate()
  date: Date;
}
