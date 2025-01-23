import { IsNotEmpty, IsString } from 'class-validator';

export class SignupRequestDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}