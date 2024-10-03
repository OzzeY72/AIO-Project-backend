import { ExerciseEntity } from '../entities';
import { IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseAnalysisExerciseDto {
  @ApiProperty({ description: 'Exercise of Day', type: ExerciseEntity })
  exercise: ExerciseEntity;

  @ApiProperty({ description: 'Sets of analysed exercise', type: Number })
  @IsNumber()
  sets: number;

  @ApiProperty({ description: 'Reps of analysed exercise', type: Number })
  @IsNumber()
  reps: number;

  @ApiProperty({ description: 'Weight of analysed exercise', type: Number })
  weight: number;
}
