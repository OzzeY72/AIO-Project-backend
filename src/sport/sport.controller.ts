import { Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/authorization';
import { SportService } from './sport.service';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';
import { CreateExerciseDayDto, UpdateExerciseDayDto } from './dto';
import { CreateExerciseRecordDto, UpdateExerciseRecordDto } from './dto';
import { CreatePlanExerciseDto, UpdatePlanExerciseDto } from './dto';
import { CreatePlanExerciseDayDto, UpdatePlanExerciseDayDto } from './dto';
import { ResponsePlanExerciseDto } from './dto';
import { Response } from 'express';
import { handleControllerError } from '@/common/utils';
import { ExerciseDay, ExerciseEntity } from './entities';
import { ResponseExerciseDay } from './dto'; 
import { ResponseExerciseRecordDto } from './dto';
import { ResponsePlanExerciseDayDto } from './dto';
import { CreateMuscleGroupDto, UpdateMuscleGroupDto } from './dto';
import { MuscleGroupService } from './services';

@ApiTags('Sport')
@ApiBearerAuth()
@Controller('sport')
@UseGuards(JwtAuthGuard)
export class SportController {
  constructor(
    private readonly sportService: SportService,
    private readonly muscleGroupService: MuscleGroupService
  ) {}
  /*
  @Get('analyse')
  @ApiOperation({ summary: 'Analyse exercise weight for day' })
  @ApiResponse({ status: 200, description: 'Return analysed day', type: ResponseAnalysisDayDto })
  async analyseExerciseDay(
    @Req() req: any, 
    @Query() query: RequestAnalysisExerciseDto,
    @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.analyseExerciseDay(userId, query.weekDay))
    );
  }
  */
  // 1. CRUD для Exercise
  @Get('exercises')
  @ApiOperation({ summary: 'Get all exercises' })
  @ApiResponse({ status: 200, description: 'Return all exercises.', type: [CreateExerciseDto] })
  async getAllExercises(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.getAllExercises(userId))
    );
  }

  @Post('exercises')
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiResponse({ status: 201, description: 'The exercise has been successfully created.', type: CreateExerciseDto })
  async createExercise(@Req() req: any, @Body() createExerciseDto: CreateExerciseDto, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.CREATED).json(await this.sportService.createExercise(userId, createExerciseDto))
    );
  }

  @Put('exercises/:id')
  @ApiOperation({ summary: 'Update an existing exercise' })
  @ApiResponse({ status: 200, description: 'The exercise has been successfully updated.', type: UpdateExerciseDto })
  async updateExercise(
    @Req() req: any, 
    @Param('id') id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Res() res: Response
  ) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.updateExercise(id, userId, updateExerciseDto))
    );
  }

  @Delete('exercises/:id')
  @ApiOperation({ summary: 'Delete an exercise' })
  @ApiResponse({ status: 200, description: 'The exercise has been successfully deleted.' })
  async deleteExercise(@Req() req: any, @Param('id') id: number, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.deleteExercise(id, userId))
    );
  }

  // 2. CRUD для Exercise Day
  @Get('exercise-days')
  @ApiOperation({ summary: 'Get all exercise days' })
  @ApiResponse({ status: 200, description: 'Return all exercise days.', type: [ResponseExerciseDay] })
  async getAllExerciseDays(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.getAllExerciseDays(userId))
    );
  }

  @Post('exercise-days')
  @ApiOperation({ summary: 'Create a new exercise day' })
  @ApiResponse({ status: 201, description: 'The exercise day has been successfully created.', type: CreateExerciseDayDto })
  async createExerciseDay(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.CREATED).json(await this.sportService.createExerciseDay(userId, {date: new Date()}))
    );
  }

  @Put('exercise-days/:id')
  @ApiOperation({ summary: 'Update an existing exercise day' })
  @ApiResponse({ status: 200, description: 'The exercise day has been successfully updated.', type: UpdateExerciseDayDto })
  async updateExerciseDay(
    @Req() req: any, 
    @Param('id') id: number,
    @Body() updateExerciseDayDto: UpdateExerciseDayDto,
    @Res() res: Response
  ) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.updateExerciseDay(id, userId, updateExerciseDayDto))
    );
  }

  @Delete('exercise-days/:id')
  @ApiOperation({ summary: 'Delete an exercise day' })
  @ApiResponse({ status: 200, description: 'The exercise day has been successfully deleted.' })
  async deleteExerciseDay(@Req() req: any, @Param('id') id: number, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.deleteExerciseDay(id, userId))
    );
  }

  // 3. CRUD для Exercise Record
  @Get('exercise-records')
  @ApiOperation({ summary: 'Get all exercise records' })
  @ApiResponse({ status: 200, description: 'Return all exercise records.', type: [ResponseExerciseRecordDto] })
  async getAllExerciseRecords(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.getAllExerciseRecords(userId))
    );
  }

  @Post('exercise-records')
  @ApiOperation({ summary: 'Create a new exercise record' })
  @ApiResponse({ status: 201, description: 'The exercise record has been successfully created.', type: ResponseExerciseRecordDto })
  async createExerciseRecord(@Req() req: any, @Body() createExerciseRecordDto: CreateExerciseRecordDto, @Res() res: Response) {
    const userId = req.user.sub; 

    return handleControllerError(res, async () => 
      res.status(HttpStatus.CREATED).json(await this.sportService.createExerciseRecord(userId, createExerciseRecordDto))
    );
  }

  @Put('exercise-records/:id')
  @ApiOperation({ summary: 'Update an existing exercise record' })
  @ApiResponse({ status: 200, description: 'The exercise record has been successfully updated.', type: ResponseExerciseRecordDto })
  async updateExerciseRecord(
    @Req() req: any, 
    @Param('id') id: number,
    @Body() updateExerciseRecordDto: UpdateExerciseRecordDto,
    @Res() res: Response
  ) {
    const userId = req.user.sub; 
    console.log(id, updateExerciseRecordDto);
    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.updateExerciseRecord(id, userId, updateExerciseRecordDto))
    );
  }

  @Delete('exercise-records/:id')
  @ApiOperation({ summary: 'Delete an exercise record' })
  @ApiResponse({ status: 200, description: 'The exercise record has been successfully deleted.' })
  async deleteExerciseRecord(@Req() req: any, @Param('id') id: number, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.deleteExerciseRecord(id, userId))
    );
  }

  // 4. CRUD для Plan Exercise
  @Get('plan-exercises')
  @ApiOperation({ summary: 'Get all plan exercises' })
  @ApiResponse({ status: 200, description: 'Return all plan exercises.', type: [ResponsePlanExerciseDto] })
  async getAllPlanExercises(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub; 

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.getAllPlanExercises(userId))
    );
  }

  @Post('plan-exercises')
  @ApiOperation({ summary: 'Create a new plan exercise' })
  @ApiResponse({ status: 201, description: 'The plan exercise has been successfully created.', type: ResponsePlanExerciseDto })
  async createPlanExercise(@Req() req: any, @Body() createPlanExerciseDto: CreatePlanExerciseDto, @Res() res: Response) {
    const userId = req.user.sub;
    console.log(createPlanExerciseDto);
    return handleControllerError(res, async () => 
      res.status(HttpStatus.CREATED).json(await this.sportService.createPlanExercise(userId, createPlanExerciseDto))
    );
  }

  @Put('plan-exercises/:id')
  @ApiOperation({ summary: 'Update an existing plan exercise' })
  @ApiResponse({ status: 200, description: 'The plan exercise has been successfully updated.', type: ResponsePlanExerciseDto })
  async updatePlanExercise(
    @Req() req: any, 
    @Param('id') id: number,
    @Body() updatePlanExerciseDto: UpdatePlanExerciseDto,
    @Res() res: Response
  ) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.updatePlanExercise(id, userId, updatePlanExerciseDto))
    );
  }

  @Delete('plan-exercises/:id')
  @ApiOperation({ summary: 'Delete a plan exercise' })
  @ApiResponse({ status: 200, description: 'The plan exercise has been successfully deleted.' })
  async deletePlanExercise(@Req() req: any, @Param('id') id: number, @Res() res: Response) {
    const userId = req.user.sub;
    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.deletePlanExercise(id, userId))
    );
  }

  // 5. CRUD для Plan Exercise Day
  @Get('plan-exercise-days')
  @ApiOperation({ summary: 'Get all plan exercise days' })
  @ApiResponse({ status: 200, description: 'Return all plan exercise days.', type: [ResponsePlanExerciseDayDto] })
  async getAllPlanExerciseDays(@Req() req: any, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.getAllPlanExerciseDays(userId))
    );
  }

  @Post('plan-exercise-days')
  @ApiOperation({ summary: 'Create a new plan exercise day' })
  @ApiResponse({ status: 201, description: 'The plan exercise day has been successfully created.', type: CreatePlanExerciseDayDto })
  async createPlanExerciseDay(@Req() req: any, @Body() createPlanExerciseDayDto: CreatePlanExerciseDayDto, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.CREATED).json(await this.sportService.createPlanExerciseDay(userId, createPlanExerciseDayDto))
    );
  }

  @Put('plan-exercise-days/:id')
  @ApiOperation({ summary: 'Update an existing plan exercise day' })
  @ApiResponse({ status: 200, description: 'The plan exercise day has been successfully updated.', type: UpdatePlanExerciseDayDto })
  async updatePlanExerciseDay(
    @Req() req: any, 
    @Param('id') id: number,
    @Body() updatePlanExerciseDayDto: UpdatePlanExerciseDayDto,
    @Res() res: Response
  ) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.updatePlanExerciseDay(id, userId, updatePlanExerciseDayDto))
    );
  }

  @Delete('plan-exercise-days/:id')
  @ApiOperation({ summary: 'Delete a plan exercise day' })
  @ApiResponse({ status: 200, description: 'The plan exercise day has been successfully deleted.' })
  async deletePlanExerciseDay(@Req() req: any, @Param('id') id: number, @Res() res: Response) {
    const userId = req.user.sub;

    return handleControllerError(res, async () => 
      res.status(HttpStatus.OK).json(await this.sportService.deletePlanExerciseDay(id, userId))
    );
  }
  // 6. CRUD для Muscle Group
  // Получить все группы мышц
  @Get()
  @ApiOperation({ summary: 'Get all muscle groups' })
  @ApiResponse({ status: 200, description: 'Return all muscle groups.', type: [CreateMuscleGroupDto] })
  async getAllMuscleGroups(@Req() req: any, @Res() res: Response) {
    return handleControllerError(res, async () =>
      res.status(HttpStatus.OK).json(await this.muscleGroupService.findAll())
    );
  }

  // Создать новую группу мышц
  @Post()
  @ApiOperation({ summary: 'Create a new muscle group' })
  @ApiResponse({ status: 201, description: 'The muscle group has been successfully created.', type: CreateMuscleGroupDto })
  async createMuscleGroup(@Req() req: any, @Body() createMuscleGroupDto: CreateMuscleGroupDto, @Res() res: Response) {
    return handleControllerError(res, async () =>
      res.status(HttpStatus.CREATED).json(await this.muscleGroupService.create(createMuscleGroupDto))
    );
  }

  // Обновить существующую группу мышц
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing muscle group' })
  @ApiResponse({ status: 200, description: 'The muscle group has been successfully updated.', type: UpdateMuscleGroupDto })
  async updateMuscleGroup(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateMuscleGroupDto: UpdateMuscleGroupDto,
    @Res() res: Response
  ) {
    return handleControllerError(res, async () =>
      res.status(HttpStatus.OK).json(await this.muscleGroupService.update(id, updateMuscleGroupDto))
    );
  }

  // Удалить группу мышц
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a muscle group' })
  @ApiResponse({ status: 200, description: 'The muscle group has been successfully deleted.' })
  async deleteMuscleGroup(@Req() req: any, @Param('id') id: number, @Res() res: Response) {
    return handleControllerError(res, async () =>
      res.status(HttpStatus.OK).json(await this.muscleGroupService.delete(id))
    );
  }
}
