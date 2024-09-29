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
  async getAllExercises(options: Partial<ExerciseEntity>) {
    return this.exerciseService.findAll(options);
  }

  async createExercise(userId: string, createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.create(userId, createExerciseDto);
  }

  async updateExercise(id: number, userId: string, updateExerciseDto: UpdateExerciseDto) {
    return this.exerciseService.update(id, userId, updateExerciseDto);
  }

  async deleteExercise(id: number) {
    return this.exerciseService.delete(id);
  }

  // Exercise Day Management
  async getAllExerciseDays(options: Partial<ExerciseDay>) {
    return this.exerciseDayService.findAll(options);
  }

  async createExerciseDay(userId: string, createExerciseDayDto: CreateExerciseDayDto) {
    return this.exerciseDayService.create(userId, createExerciseDayDto);
  }

  async updateExerciseDay(id: number, userId: string, updateExerciseDayDto: UpdateExerciseDayDto) {
    return this.exerciseDayService.update(id, userId, updateExerciseDayDto);
  }

  async deleteExerciseDay(id: number) {
    return this.exerciseDayService.delete(id);
  }

  // Exercise Record Management
  async getAllExerciseRecords(options: Partial<ExerciseRecordEntity>) {
    return this.exerciseRecordService.findAll(options);
  }

  async createExerciseRecord(userId: string, createExerciseRecordDto: CreateExerciseRecordDto) {
    return this.exerciseRecordService.create(userId, createExerciseRecordDto);
  }

  async updateExerciseRecord(id: number, userId: string, updateExerciseRecordDto: UpdateExerciseRecordDto) {
    return this.exerciseRecordService.update(id, userId, updateExerciseRecordDto);
  }

  async deleteExerciseRecord(id: number) {
    return this.exerciseRecordService.delete(id);
  }

  // Plan Exercise Management
  async getAllPlanExercises(options?: Partial<PlanExercise>) {
    return this.planExerciseService.findAll(options);
  }

  async createPlanExercise(userId: string, createPlanExerciseDto: CreatePlanExerciseDto) {
    return this.planExerciseService.create(userId, createPlanExerciseDto);
  }

  async updatePlanExercise(id: number, userId: string, updatePlanExerciseDto: UpdatePlanExerciseDto) {
    return this.planExerciseService.update(id, userId, updatePlanExerciseDto);
  }

  async deletePlanExercise(id: number) {
    return this.planExerciseService.delete(id);
  }

  // Plan Exercise Day Management
  async getAllPlanExerciseDays(options?: Partial<PlanExercise>) {
    return this.planExerciseDayService.findAll(options);
  }
  
  async createPlanExerciseDay(userId: string, createPlanExerciseDayDto: CreatePlanExerciseDayDto) {
    return this.planExerciseDayService.create(userId, createPlanExerciseDayDto);
  }

  async updatePlanExerciseDay(id: number, userId: string, updatePlanExerciseDayDto: UpdatePlanExerciseDayDto) {
    return this.planExerciseDayService.update(id, userId, updatePlanExerciseDayDto);
  }

  async deletePlanExerciseDay(id: number) {
    return this.planExerciseDayService.delete(id);
  }
}
