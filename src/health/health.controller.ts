import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
    constructor (
        private healthService: HealthService
    ) {}

    @Get('init')
    async initHealth() {
        this.healthService.init();
        return HttpStatus.OK;
    }  
}
