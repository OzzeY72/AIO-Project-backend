import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMuscleGroupDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;
}