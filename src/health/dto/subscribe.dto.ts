import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({ description: 'Count of bad dozes per day' })
  countPerDay: number;

  @ApiProperty({ description: 'Id of health' })
  healthId: number;
}