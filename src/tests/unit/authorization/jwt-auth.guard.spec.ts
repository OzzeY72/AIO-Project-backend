import { JwtAuthGuard } from '@/authorization';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES } from '@/common/error-messages';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockJwtService: JwtService;

  beforeEach(() => {
    mockJwtService = {
      verify: jest.fn(),
    } as unknown as JwtService;
    guard = new JwtAuthGuard(mockJwtService);
  });

  const mockExecutionContext = (authHeader?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { authorization: authHeader },
      }),
    }),
  } as unknown as ExecutionContext);

  it('should allow access with a valid token', async () => {
    const validTokenPayload = { sub: 'userId' };
    (mockJwtService.verify as jest.Mock).mockReturnValue(validTokenPayload);

    const context = mockExecutionContext('Bearer valid-token');

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', { secret: process.env.JWT_SECRET });
  });

  it('should throw UnauthorizedException if no Authorization header is present', async () => {
    const context = mockExecutionContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(mockJwtService.verify).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    (mockJwtService.verify as jest.Mock).mockImplementation(() => {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    });

    const context = mockExecutionContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(mockJwtService.verify).toHaveBeenCalledWith('invalid-token', { secret: process.env.JWT_SECRET });
  });
});
