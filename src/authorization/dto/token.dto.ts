import { IsString, IsNotEmpty } from 'class-validator';

export class TokenRequestDto {
  @IsString()
  @IsNotEmpty()
  grantType: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  redirectUri: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @IsString()
  @IsNotEmpty()
  provider: string;
}