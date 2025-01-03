import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty({ description: 'Name of the exercise' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Muscle group' })
  muscleGroups: string[];
}
