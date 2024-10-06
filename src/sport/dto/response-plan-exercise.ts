import { ApiProperty } from '@nestjs/swagger';

export class ResponsePlanExerciseDto {
  @ApiProperty({ description: 'ID of Plan Exercise' })
  id: number;

  @ApiProperty({ description: 'Exercise name' })
  exercise: string;

  @ApiProperty({ description: 'Number of sets' })
  sets: number;

  @ApiProperty({ description: 'Number of reps' })
  reps: number;

  @ApiProperty({ description: 'ID of the associated plan exercise day' })
  planExerciseDayId: number;
}
