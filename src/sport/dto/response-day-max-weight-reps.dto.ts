import { ApiProperty } from '@nestjs/swagger';
import { CreateMuscleGroupDto } from '.';

export class ResponseDayToMaxWeight
{
    @ApiProperty({ description: 'Day of this exercise' })
    date: Date;
    
    @ApiProperty({ description: 'Tonnage of this exercise for given day' })
    maxWeight: number;
}

export class ResponseDayMaxWeight {
    @ApiProperty({ description: 'Array of pairs - Group of date:max weight' })
    pairs: ResponseDayToMaxWeight[];
}
