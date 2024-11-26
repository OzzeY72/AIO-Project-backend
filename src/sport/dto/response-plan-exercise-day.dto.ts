import { ApiProperty } from '@nestjs/swagger';
import { ResponsePlanExerciseDto } from './response-plan-exercise';

export class ResponsePlanExerciseDayDto {
    @ApiProperty({ description: 'Name of weekday' })
    weekDay: string;

    @ApiProperty({ description: 'ID of the associated exercise' })
    planExercises: ResponsePlanExerciseDto[];
}
