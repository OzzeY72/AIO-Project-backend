import { ApiProperty } from '@nestjs/swagger';
import { ResponseExerciseRecordDto } from './response-exercise-record';

export class ResponseExerciseDay {
  @ApiProperty({ description: 'ID of exercise day' })
  id: number;

  @ApiProperty({ description: 'Date of the exercise day' })
  date: Date;

  @ApiProperty({ description: 'exerciseRecords of the exercise day', type: [ResponseExerciseRecordDto]})
  exerciseRecords: ResponseExerciseRecordDto[];

  @ApiProperty({ description: 'UserID of exercise day' })
  userId: string;
}
