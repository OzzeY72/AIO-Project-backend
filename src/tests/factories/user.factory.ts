import { UserService } from '@/user';
import { User } from '@/user/entities';

export const createTestUser = async (userService: UserService) => {
  return await userService.CreateUser({
    email: 'test@gmail.com',
    name: 'TestUser',
    providerId: '101718671953721944963',
    userLogo: 'https://example.com/user.png'
  }, 'google');
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

export const createMockUser = (overrides?: Partial<typeof mockUser>) => ({
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
  healthRecords: [],
  products: [],
  ...overrides,
});