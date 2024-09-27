import { Controller, Get, Res, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '@/authorization';
import { UserService } from '@/user';
import { UserResponseDto } from '@/user/dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('info')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get user DTO' })
    @ApiResponse({ status: 200, description: 'UserResponseDto', type: UserResponseDto })
    async userInfo(
        @Req() request: any,
        @Res() res: Response
    ): Promise<Response<UserResponseDto>>{
        const accessInfo = request.user as any;
        const userId = accessInfo.sub;

        const user = await this.userService.FindUser({userId: userId});
        
        if(!user) {
            return res.status(HttpStatus.NOT_FOUND).json({ error: 'user with this id does not exist!' });
        }
        
        return res.status(HttpStatus.OK).json(this.userService.toUserDto(user));
    }
}
