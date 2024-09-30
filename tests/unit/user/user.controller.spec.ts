import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user';
import { UserService } from '@/user';
import { HttpStatus } from '@nestjs/common';
import { UserResponseDto } from '@/user/dto';
import { JwtAuthGuard } from '@/authorization';
import { toTestUserDto } from '../../helpers/user.helper';
import { ERROR_MESSAGES } from '@/common/error-messages';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express'; 

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    FindUser: jest.fn(),
    toUserDto: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@gmail.com',
    name: 'Test User',
    provider: 'google',
    providerId: '101718671953721944963',
    userId: 'some-user-id',
    userLogo: 'https://example.com/user.png',
    accessToken: 'some-access-token',
    refreshToken: 'some-refresh-token',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
    healthRecords: [] ,
    products: [],
  };  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue(true),
          }
        },
        {
          provide: JwtAuthGuard,
          useValue: {
              canActivate: jest.fn().mockReturnValue(true),
          },
      },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('userInfo', () => {
    it('should return user DTO if user exists', async () => {
      const userId = 'some-user-id';
      const request = { user: { sub: userId } };
      const mockUserDto: UserResponseDto = toTestUserDto(mockUser);

      mockUserService.FindUser.mockResolvedValue(mockUser);
      mockUserService.toUserDto.mockReturnValue(mockUserDto);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
     
      await userController.userInfo(request, response);

      expect(userService.FindUser).toHaveBeenCalledWith({ userId });
      expect(userService.toUserDto).toHaveBeenCalledWith(mockUser);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockUserDto);
    });

    it('should return 404 if user does not exist', async () => {
      const userId = 'non-existent-user-id';
      const request = { user: { sub: userId } };

      mockUserService.FindUser.mockResolvedValue(null);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
     
      await userController.userInfo(request, response);

      expect(userService.FindUser).toHaveBeenCalledWith({ userId });
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    });
  });
});
