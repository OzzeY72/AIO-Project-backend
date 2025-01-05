import { Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/authorization';
import { Response } from 'express';
import { handleControllerError } from '@/common/utils';
import { ResponseExercisePopularity, RequestPeriod, ResponseRepsByGroup, RequestDayTonnage, ResponseDayTonnage } from '../dto/';
import { ExerciseAnalysisService } from '../services';

@ApiTags('Sport graphics')
@ApiBearerAuth()
@Controller('sport-graphics')
@UseGuards(JwtAuthGuard)
export class SportGraphicsController {
  constructor(
    private exerciseAnalysisService: ExerciseAnalysisService,
  ) {}

  @Get('exercise-popularity')
  @ApiOperation({ summary: 'Calculate data to build exercise popularity graphic' })
  @ApiResponse({ status: 200, description: 'Return data to build exercise popularity graphic', type: ResponseExercisePopularity })
  async exercisePopularityGraphic(
    @Req() req: any, 
    @Query() query: RequestPeriod,
    @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.exerciseAnalysisService.exercisePopularityGraphic(userId, query))
    );
  }

  @Get('reps-by-group')
  @ApiOperation({ summary: 'Calculate data to build reps to muscle group graphic' })
  @ApiResponse({ status: 200, description: 'Return data to build reps to muscle group graphic', type: ResponseRepsByGroup })
  async repsByGroup(
    @Req() req: any, 
    @Query() query: RequestPeriod,
    @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.exerciseAnalysisService.repsByGroup(userId, query))
    );
  }

  @Get('day-tonnage')
  @ApiOperation({ summary: 'Calculate data to build day to tonnage graphic of one exercise' })
  @ApiResponse({ status: 200, description: 'Return data to build day to tonnage graphic of one exercise', type: ResponseDayTonnage })
  async dayTonnage(
    @Req() req: any, 
    @Query() query: RequestDayTonnage,
    @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.exerciseAnalysisService.dayTonnage(userId, query))
    );
  }

}
