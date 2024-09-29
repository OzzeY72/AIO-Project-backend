import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanExerciseDto } from './create-plan-exercise.dto';

export class UpdatePlanExerciseDto extends PartialType(CreatePlanExerciseDto) {}
