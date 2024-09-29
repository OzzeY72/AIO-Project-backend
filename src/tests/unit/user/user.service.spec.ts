import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/user';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/entities';
import { OpenID } from '@/interfaces/openid';
import { v4 as uuidv4 } from 'uuid';
import { UserCreateDto } from '@/user/dto';
import { createMockUser } from '@/tests/factories/user.factory';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<User>;
    
    const mockUser = createMockUser();

    const mockUserRepository = {
        findOneBy: jest.fn(),
        create: jest.fn().mockImplementation((userData) => ({
            ...userData,
            userId: uuidv4(),
        })),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('FindUser', () => {
        it('should return a user if found', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(mockUser);
            const result = await userService.FindUser({ userId: mockUser.userId });
            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: mockUser.userId });
        });

        it('should return undefined if user not found', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(undefined);
            const result = await userService.FindUser({ userId: 'non-existing-id' });
            expect(result).toBeUndefined();
            expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 'non-existing-id' });
        });
    });

    describe('CreateUser', () => {
        it('should create and return a new user', async () => {
            const openId: OpenID = {
                email: 'test@example.com',
                name: 'Test User',
                providerId: '12345',
                userLogo: 'https://example.com/logo.png',
            };

            mockUserRepository.save.mockResolvedValue(mockUser);

            const result = await userService.CreateUser(openId, 'google');

            expect(mockUserRepository.create).toHaveBeenCalledWith({
                email: openId.email,
                name: openId.name,
                provider: 'google',
                providerId: openId.providerId,
                userLogo: openId.userLogo,
                userId: expect.any(String),
            });
            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                email: expect.any(String),
                name: expect.any(String),
                provider: expect.any(String),
                providerId: expect.any(String),
                userLogo: expect.any(String),
                userId: expect.any(String),
            }));
            expect(result).toEqual(mockUser);
        });
    });

    describe('toUserDto', () => {
        it('should convert a User to UserResponseDto', () => {
            const userDto = userService.toUserDto(mockUser);
            expect(userDto).toEqual({
                email: mockUser.email,
                name: mockUser.name,
                userId: mockUser.userId,
                userLogo: mockUser.userLogo,
            });
        });
    });
});
