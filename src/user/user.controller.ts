import { ERROR_MESSAGES } from '@/common/error-messages';
import { UserService } from '@/user';
import { UserResponseDto } from '@/user/dto';
import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
//@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('info')
    @ApiBearerAuth()
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
            return res.status(HttpStatus.NOT_FOUND).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        
        return res.status(HttpStatus.OK).json(this.userService.toUserDto(user));
    }
}
