import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseRecordDto {
  @ApiProperty({ description: 'Name of the associated exercise' })
  @IsString()
  exercise: string;

  @ApiProperty({ description: 'Weight used in the exercise' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'Number of repetitions' })
  @IsNumber()
  reps: number;

  @ApiProperty({ description: 'ID of the associated exercise day', required: false })
  @IsOptional()
  @IsNumber()
  exerciseDayId?: number;
}
