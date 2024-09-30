import { Injectable } from '@nestjs/common';
import { ExerciseDay, ExerciseEntity, ExerciseRecordEntity, PlanExercise } from './entities';
import { ExerciseService } from './services';
import { ExerciseDayService } from './services';
import { ExerciseRecordService } from './services';
import { PlanExerciseService } from './services';
import { PlanExerciseDayService } from './services';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';
import { CreateExerciseDayDto, UpdateExerciseDayDto } from './dto';
import { CreateExerciseRecordDto, UpdateExerciseRecordDto } from './dto';
import { CreatePlanExerciseDto, UpdatePlanExerciseDto } from './dto';
import { CreatePlanExerciseDayDto, UpdatePlanExerciseDayDto } from './dto';

@Injectable()
export class SportService {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly exerciseDayService: ExerciseDayService,
    private readonly exerciseRecordService: ExerciseRecordService,
    private readonly planExerciseService: PlanExerciseService,
    private readonly planExerciseDayService: PlanExerciseDayService,
  ) {}

  // Exercise Management
  async getAllExercises(userId: string, options?: Partial<ExerciseEntity>) {
    return await this.exerciseService.findAll(userId, options);
  }

  async createExercise(userId: string, createExerciseDto: CreateExerciseDto) {
    return await this.exerciseService.create(userId, createExerciseDto);
  }

  async updateExercise(id: number, userId: string, updateExerciseDto: UpdateExerciseDto) {
    return await this.exerciseService.update(id, userId, updateExerciseDto);
  }

  async deleteExercise(id: number, userId: string) {
    return await this.exerciseService.delete(id, userId);
  }

  // Exercise Day Management
  async getAllExerciseDays(userId: string, options?: Partial<ExerciseDay>) {
    const res = await this.exerciseDayService.findAll(userId, options);
    console.log(res);
    return res;
  }

  async createExerciseDay(userId: string, createExerciseDayDto: CreateExerciseDayDto) {
    return await this.exerciseDayService.create(userId, createExerciseDayDto);
  }

  async updateExerciseDay(id: number, userId: string, updateExerciseDayDto: UpdateExerciseDayDto) {
    return await this.exerciseDayService.update(id, userId, updateExerciseDayDto);
  }

  async deleteExerciseDay(id: number, userId: string) {
    return await this.exerciseDayService.delete(id, userId);
  }

  // Exercise Record Management
  async getAllExerciseRecords(userId: string, options?: Partial<ExerciseRecordEntity>) {
    return await this.exerciseRecordService.findAll(userId, options);
  }

  async createExerciseRecord(userId: string, createExerciseRecordDto: CreateExerciseRecordDto) {
    return await this.exerciseRecordService.create(userId, createExerciseRecordDto);
  }

  async updateExerciseRecord(id: number, userId: string, updateExerciseRecordDto: UpdateExerciseRecordDto) {
    return await this.exerciseRecordService.update(id, userId, updateExerciseRecordDto);
  }

  async deleteExerciseRecord(id: number, userId: string) {
    return await this.exerciseRecordService.delete(id, userId);
  }

  // Plan Exercise Management
  async getAllPlanExercises(userId: string, options?: Partial<PlanExercise>) {
    const res = await this.planExerciseService.findAll(userId, options);
    console.log(res);
    return res;
  }

  async createPlanExercise(userId: string, createPlanExerciseDto: CreatePlanExerciseDto) {
    return await this.planExerciseService.create(userId, createPlanExerciseDto);
  }

  async updatePlanExercise(id: number, userId: string, updatePlanExerciseDto: UpdatePlanExerciseDto) {
    return await this.planExerciseService.update(id, userId, updatePlanExerciseDto);
  }

  async deletePlanExercise(id: number, userId: string) {
    return await this.planExerciseService.delete(id, userId);
  }

  // Plan Exercise Day Management
  async getAllPlanExerciseDays(userId: string, options?: Partial<PlanExercise>) {
    return await this.planExerciseDayService.findAll(userId, options);
  }
  
  async createPlanExerciseDay(userId: string, createPlanExerciseDayDto: CreatePlanExerciseDayDto) {
    return await this.planExerciseDayService.create(userId, createPlanExerciseDayDto);
  }

  async updatePlanExerciseDay(id: number, userId: string, updatePlanExerciseDayDto: UpdatePlanExerciseDayDto) {
    return await this.planExerciseDayService.update(id, userId, updatePlanExerciseDayDto);
  }

  async deletePlanExerciseDay(id: number, userId: string) {
    return await this.planExerciseDayService.delete(id, userId);
  }
}
