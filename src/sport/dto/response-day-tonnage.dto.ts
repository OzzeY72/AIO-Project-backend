import { ApiProperty } from '@nestjs/swagger';
import { CreateMuscleGroupDto } from '.';

export class ResponseDayToTonnage
{
    @ApiProperty({ description: 'Day of this exercise' })
    date: Date;
    
    @ApiProperty({ description: 'Tonnage of this exercise for given day' })
    tonnage: number;
}

export class ResponseDayTonnage {
    @ApiProperty({ description: 'Array of pairs - Group of date:tonnage' })
    pairs: ResponseDayToTonnage[];
}
