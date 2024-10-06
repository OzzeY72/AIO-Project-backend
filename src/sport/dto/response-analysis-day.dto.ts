import { ApiProperty } from '@nestjs/swagger';
import { ResponseAnalysisExerciseDto } from './response-analysis-exercise.dto';

export class ResponseAnalysisDayDto {
  @ApiProperty({ description: 'Planned exercise of Day', type: [[ResponseAnalysisExerciseDto]] })
  planExercises: ResponseAnalysisExerciseDto[][];
  
  @ApiProperty({ description: 'Week day of analysed day', type: Number })
  weekDay: number;
}
