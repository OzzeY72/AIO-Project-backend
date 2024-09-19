import { Controller, Get, HttpStatus, Body, Post, Res, Query, UseGuards, Req, Param} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../authorization/guards/jwt-auth.guard';
import { handleControllerError } from '../common/utils/error-wrapper';
import { SubscribeDto, HealthRecordDto, HealthService, HealthStreakResponseDto, HealthStreakDto } from '.';
import { CompleteStatDto } from './dto/health-stat.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor (
        private healthService: HealthService
    ) {}

    @Get('records')
    @ApiOperation({ summary: 'Get all streaks of certain user certain health' })
    @ApiOkResponse({
        description: 'List of health records',
        type: [HealthRecordDto]
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getRecords(
        @Req() request: any,
        @Query('healthId') healthId: number,
        @Query('month') month?: number,
        @Query('year') year?: number,
    ): Promise<HealthRecordDto[]>  {
        const userId = request.user.sub;
        console.log(healthId, month, year);
        return await this.healthService.getAllByUserAndHealth(userId, healthId, month, year);
    }

    @Get('stat')
    @ApiOperation({ summary: 'Get all user stat' })
    @ApiOkResponse({
        description: 'List of health stats',
        type: CompleteStatDto,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getStats(
        @Req() request: any,
        @Query('healthId') healthId: number,
    ): Promise<CompleteStatDto>  {
        const userId = request.user.sub;
        const stat = await this.healthService.getUserStat(userId, healthId);
        console.log(stat);
        return stat;
    }

    @Post('subscribe')
    @ApiOperation({ summary: 'Subscribe user to a certain health' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({ description: 'Data for subscribe', type: SubscribeDto })
    async registrateUser(
        @Body() subscribeDto: SubscribeDto,
        @Req() request: any,
        @Res() res
    ) {
        return handleControllerError(res, async () => {
            const userId = request.user.sub;
            const register = await this.healthService.registrateUserToHealth(
                subscribeDto.countPerDay, 
                subscribeDto.pricePerThing, 
                userId, 
                subscribeDto.healthId
            );
            return res.status(HttpStatus.OK).json(register);
        });
    }  

    @Post('streak')
    @ApiOperation({ summary: 'Create or end streak' })
    @ApiResponse({ status: 200, description: '' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({ description: 'Health to create or end streak', type: HealthStreakDto })
    async toggleHealthStreak(
        @Body() healthStreakBody: HealthStreakDto,
        @Req() request: any,
        @Res() res
    ) {
        console.log("STREAK");
        return handleControllerError(res, async () => {
            const userId = request.user.sub;
            await this.healthService.toggleHealthStreak(userId, healthStreakBody);
            return res.status(HttpStatus.OK).json({ message: 'Streak toggled successfully' });
        });
    }

    @Get('streak')
    @ApiOperation({ summary: 'Is there any continous streak?' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Boolean meaning streak exist or doesnt',
        type: HealthStreakResponseDto
    })
    async isStreakExist(
        @Req() request: any,
        @Query('healthId') healthId: number,
        @Res() res
    ): Promise<HealthStreakResponseDto> {
        return handleControllerError(res, async () => {
            const userId = request.user.sub;
            const status = await this.healthService.isStreakExist(userId, healthId);
            console.log(status);
            return res.status(HttpStatus.OK).json(status);
        });
    }

    /*
    @Post('endStreak')
    @ApiOperation({ summary: 'End existing streak' })
    @ApiResponse({ status: 200, description: '' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({ description: 'Health to end streak', type: HealthStreakDto })
    async endHealthStreak(
        @Body('healthId') healthId: number,
        @Req() request: any,
        @Res() res
    ) {
        return handleControllerError(res, async () => {
            const userId = request.user.sub;
            await this.healthService.endHealthStreak(userId, healthId);
            return res.status(HttpStatus.OK).json({ message: 'Streak ended successfully' });
        });
    }*/

    @Post('init')
    @ApiOperation({ summary: 'Create new record in health table' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async initHealth(
        @Body('name') name: string,
        @Body('description') description: string,
    ) {
        await this.healthService.init(name, description);
        return {name,description};
    }  
}
