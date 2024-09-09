import { Controller, Get, HttpStatus, Body, Post, Res, Query} from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { handleControllerError } from '../common/utils/error-wrapper';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor (
        private healthService: HealthService
    ) {}

    @Get('records')
    @ApiOperation({ summary: 'Get all streaks of certain user certain health' })
    @ApiResponse({ status: 200, description: 'Array of HealthRecord' })
    async getRecords(
        @Query('userId') userId: string,
        @Query('healthId') healthId: number,
    ) {
        return await this.healthService.getAllByUserAndHealth(userId, healthId);
    }

    @Post('subscribe')
    @ApiOperation({ summary: 'Subscribe user to a certain health' })
    @ApiResponse({ status: 200, description: 'Success' })
    async registrateUser(
        @Body('countPerDay') countPerDay: number,
        @Body('userId') userId: string,
        @Body('healthId') healthId: number,
        @Res() res
    ) {
        return handleControllerError(res, async () => {
            await this.healthService.registrateUserToHealth(countPerDay, userId, healthId);
            return res.status(HttpStatus.OK).json({ message: 'User subscribed successfully' });
        });
    }  

    @Post('beginStreak')
    @ApiOperation({ summary: 'Create new streak' })
    @ApiResponse({ status: 200, description: '' })
    async beginHealthStreak(
        @Body('userId') userId: string,
        @Body('healthId') healthId: number,
        @Res() res
    ) {
        return handleControllerError(res, async () => {
            await this.healthService.beginHealthStreak(userId, healthId);
            return res.status(HttpStatus.OK).json({ message: 'Streak started successfully' });
        });
    }

    @Post('endStreak')
    @ApiOperation({ summary: 'End existing streak' })
    @ApiResponse({ status: 200, description: '' })
    async endHealthStreak(
        @Body('userId') userId: string,
        @Body('healthId') healthId: number,
        @Res() res
    ) {
        return handleControllerError(res, async () => {
            await this.healthService.endHealthStreak(userId, healthId);
            return res.status(HttpStatus.OK).json({ message: 'Streak ended successfully' });
        });
    }

    @Post('init')
    @ApiOperation({ summary: 'Create new record in health table' })
    async initHealth(
        @Body('name') name: string,
        @Body('description') description: string,
    ) {
        await this.healthService.init(name, description);
        return {name,description};
    }  
}
