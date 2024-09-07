import { Controller, Get, Res, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../authorization/jwt-auth.guard';
import { UserService } from './user.service';
import { Response } from 'express';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('info')
    @UseGuards(JwtAuthGuard)
    async logo(
        @Req() request: any,
        @Res() res: Response
    ) {
        const accessInfo = request.user as any;
        const userId = accessInfo.sub;

        const user = await this.userService.FindUser({userId: userId});
        
        if(!user) {
            return res.status(HttpStatus.NOT_FOUND).json({ error: 'user with this id does not exist!' });
        }
        
        return res.status(HttpStatus.OK).json(this.userService.toUserDto(user));
    }
}
