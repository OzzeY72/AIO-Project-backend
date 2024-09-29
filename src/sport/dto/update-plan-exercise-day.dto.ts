import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanExerciseDayDto } from './create-plan-exercise-day.dto';

export class UpdatePlanExerciseDayDto extends PartialType(CreatePlanExerciseDayDto) {}
