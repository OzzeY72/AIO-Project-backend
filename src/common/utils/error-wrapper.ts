import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export async function handleControllerError(
  res: Response, 
  controllerMethod: () => Promise<any>
): Promise<any> {
  try {
    return await controllerMethod();
  } catch (error) {
    console.log(error.message);
    throw error;
    //return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
export async function throwServiceError(
  controllerMethod: () => Promise<any>
): Promise<any> {
  try {
    return await controllerMethod();
  } catch (error) {
    throw error;
  }
}