import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthorizationService } from '@/authorization';
import { ERROR_MESSAGES } from '@/common/error-messages';
import { verify } from 'crypto';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService, 
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('ClientCredentialsVerify', () => {
    it('should throw UnauthorizedException if client credentials are invalid', () => {
      const invalidClientId = 'invalid_client_id';
      const invalidClientSecret = 'invalid_client_secret';

      expect(()=>{
        service.ClientCredentialsVerify(invalidClientId, invalidClientSecret);
      }).toThrow(new UnauthorizedException(ERROR_MESSAGES.INVALID_CLIENT_CREDENTIALS));
    });

    it('should not throw UnauthorizedException if client credentials are valid', () => {
      const validClientId = 'your_client_id';
      const validClientSecret = 'your_client_secret';

      expect(()=>{
        service.ClientCredentialsVerify(validClientId, validClientSecret);
      }).not.toThrow();
    });
  });

  describe('generateAccessToken', () => {
    it('should call jwtService.sign with correct payload', () => {
      const userId = 'some-user-id';
      const expectedPayload = { sub: userId };

      service.generateAccessToken(userId);

      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('validateToken', () => {
    it('should return payload if token is valid', async () => {
      const validToken = 'valid-token';
      const payload = { sub: 'user-id' };
      (jwtService.verify as jest.Mock).mockReturnValue(payload);

      const result = await service.validateToken(validToken);

      expect(result).toBe(payload);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const invalidToken = 'invalid-token';
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      });

      await expect(service.validateToken(invalidToken)).rejects.toThrow(
        new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN),
      );
    });
  });

  describe('generateIdToken', () => {
    it('should call jwtService.sign with correct payload', () => {
      const userId = 'some-user-id';
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const expectedPayload = { sub: userId, name, email };

      service.generateIdToken(userId, name, email);

      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
