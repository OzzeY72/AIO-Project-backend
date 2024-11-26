import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePlanExerciseDto, CreatePlanExerciseSetDto } from './create-plan-exercise.dto';

export class UpdatePlanExerciseSetDto extends PartialType(CreatePlanExerciseSetDto) {
    @ApiProperty({description: 'Id', nullable: true})
    @IsNumber()
    id: number;
}
export class UpdatePlanExerciseDto {
    @ApiProperty({ description: 'Set of planexercise' })
    sets: UpdatePlanExerciseSetDto[];

    @ApiProperty({ description: 'Name of the associated exercise' })
    @IsString()
    exercise: string;

    @ApiProperty({ description: 'ID of the associated plan day' })
    @IsNumber()
    planExerciseDayId: number;
}
