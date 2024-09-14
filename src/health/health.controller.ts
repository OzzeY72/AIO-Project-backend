import { Controller, Get, HttpStatus, Body, Post, Res, Query, UseGuards, Req, Param} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../authorization/guards/jwt-auth.guard';
import { handleControllerError } from '../common/utils/error-wrapper';
import { SubscribeDto, HealthRecordDto, HealthService, HealthStatDto } from '.';

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
        type: HealthStatDto,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getStats(
        @Req() request: any,
        @Query('healthId') healthId: number,
    ): Promise<HealthStatDto>  {
        const userId = request.user.sub;
        return await this.healthService.getUserStat(userId, healthId);
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
            await this.healthService.registrateUserToHealth(subscribeDto.countPerDay, userId, subscribeDto.healthId);
            return res.status(HttpStatus.OK).json({ message: 'User subscribed successfully' });
        });
    }  

    @Post('beginStreak')
    @ApiOperation({ summary: 'Create new streak' })
    @ApiResponse({ status: 200, description: '' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async beginHealthStreak(
        @Body('healthId') healthId: number,
        @Req() request: any,
        @Res() res
    ) {
        return handleControllerError(res, async () => {
            const userId = request.user.sub;
            await this.healthService.beginHealthStreak(userId, healthId);
            return res.status(HttpStatus.OK).json({ message: 'Streak started successfully' });
        });
    }

    @Post('endStreak')
    @ApiOperation({ summary: 'End existing streak' })
    @ApiResponse({ status: 200, description: '' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
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
    }

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
