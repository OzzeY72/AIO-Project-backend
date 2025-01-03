import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateMuscleGroupDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;
}