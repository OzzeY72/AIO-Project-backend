import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDayDto } from './create-exercise-day.dto';

export class UpdateExerciseDayDto extends PartialType(CreateExerciseDayDto) {}
