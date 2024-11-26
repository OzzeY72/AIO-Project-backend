import { ApiProperty } from '@nestjs/swagger';

export class ResponsePlanExerciseSetDto {
  @ApiProperty({ description: 'ID of Plan Exercise' })
  id: number;

  @ApiProperty({ description: 'Weight' })
  weight: number;

  @ApiProperty({ description: 'Number of repetitions per set' })
  reps: number;
}

export class ResponsePlanExerciseDto {
  @ApiProperty({ description: 'ID of the associated exercise' })
  sets: ResponsePlanExerciseSetDto[];

  @ApiProperty({ description: 'ID of Plan Exercise' })
  id: number;

  @ApiProperty({ description: 'Exercise name' })
  exercise: string;

  @ApiProperty({ description: 'ID of the associated plan exercise day' })
  planExerciseDayId: number;
}
