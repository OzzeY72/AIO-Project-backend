import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from '@/authorization';
import { AuthorizationService } from '@/authorization';
import { OAuthFactory } from '@/authorization/factories';
import { UserService } from '@/user/user.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { createMockUser } from '../../factories/user.factory';
import { ERROR_MESSAGES } from '@/common/error-messages';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthorizationController', () => {
  let controller: AuthorizationController;
  let mockAuthorizationService: AuthorizationService;
  let mockUserService: UserService;
  let mockOAuthFactory: OAuthFactory;
  let mockRes: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
      providers: [
        {
          provide: AuthorizationService,
          useValue: {
            ClientCredentialsVerify: jest.fn(),
            generateAccessToken: jest.fn(),
            generateIdToken: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            FindUser: jest.fn(),
            CreateUser: jest.fn(),
          },
        },
        {
          provide: OAuthFactory,
          useValue: {
            getProvider: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthorizationController>(AuthorizationController);
    mockAuthorizationService = module.get<AuthorizationService>(AuthorizationService);
    mockUserService = module.get<UserService>(UserService);
    mockOAuthFactory = module.get<OAuthFactory>(OAuthFactory);
    mockRes = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('authorize', () => {
    it('should redirect to the correct URL with authorization code', () => {
      const query = {
        responseType: 'code',
        clientId: 'client_id',
        redirectUri: 'http://example.com',
        scope: 'openid',
        state: 'state123',
      };

      controller.authorize(
        query.responseType,
        query.clientId,
        query.redirectUri,
        query.scope,
        query.state,
        mockRes as Response,
      );
      //TODO Mock generated autrhorization code
      expect(mockRes.redirect).toHaveBeenCalledWith(`${query.redirectUri}?code=generated_authorization_code&state=${query.state}`);
    });
  });

  describe('token', () => {
    it('should return tokens when valid authorization code is provided', async () => {
      const body = {
        grantType: 'authorization_code',
        code: 'valid_code',
        redirectUri: 'http://example.com',
        clientId: 'client_id',
        clientSecret: 'client_secret',
        provider: 'google',
      };

      const mockProvider = {
        getToken: jest.fn().mockResolvedValue({
          providerId: '12345',
          email: 'test@gmail.com',
          name: 'Test User',
          userLogo: 'https://example.com/logo.png',
        }),
      };

      jest.spyOn(mockOAuthFactory, 'getProvider').mockReturnValue(mockProvider);
      jest.spyOn(mockUserService, 'FindUser').mockResolvedValue(null); // No user found, so we create one
      jest.spyOn(mockUserService, 'CreateUser').mockResolvedValue(createMockUser({userId: "new_user_id"}));
      jest.spyOn(mockAuthorizationService, 'generateAccessToken').mockReturnValue('access_token');
      jest.spyOn(mockAuthorizationService, 'generateIdToken').mockReturnValue('id_token');
      jest.spyOn(mockAuthorizationService, 'ClientCredentialsVerify').mockReturnValue();

      await controller.token(
        body.grantType,
        body.code,
        body.redirectUri,
        body.clientId,
        body.clientSecret,
        body.provider,
        mockRes as Response,
      );

      expect(mockAuthorizationService.ClientCredentialsVerify).toHaveBeenCalledWith(body.clientId, body.clientSecret);
      expect(mockAuthorizationService.ClientCredentialsVerify).not.toThrow();
      expect(mockProvider.getToken).toHaveBeenCalledWith(body.code);
      expect(mockUserService.FindUser).toHaveBeenCalledWith({ provider: body.provider, providerId: '12345' });
      expect(mockUserService.CreateUser).toHaveBeenCalledWith({
        providerId: '12345',
        email: 'test@gmail.com',
        name: 'Test User',
        userLogo: 'https://example.com/logo.png',
      }, body.provider);
      expect(mockAuthorizationService.generateAccessToken).toHaveBeenCalledWith('new_user_id');
      expect(mockAuthorizationService.generateIdToken).toHaveBeenCalledWith('new_user_id', 'Test User', 'test@gmail.com');
      expect(mockRes.json).toHaveBeenCalledWith({
        access_token: 'access_token',
        id_token: 'id_token',
        expires_in: 3600,
        token_type: 'Bearer',
      });
    });

    it('should return an error if grant_type is not "authorization_code"', async () => {
      const body = {
        grantType: 'invalid_grant',
        code: 'valid_code',
        redirectUri: 'http://example.com',
        clientId: 'client_id',
        clientSecret: 'client_secret',
        provider: 'google',
      };

      await controller.token(
        body.grantType,
        body.code,
        body.redirectUri,
        body.clientId,
        body.clientSecret,
        body.provider,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.BAD_GRANT_TYPE });
    });

    it('should return an error if an exception is thrown', async () => {
      const body = {
        grantType: 'authorization_code',
        code: 'valid_code',
        redirectUri: 'http://example.com',
        clientId: 'client_id',
        clientSecret: 'client_secret',
        provider: 'google',
      };

      jest.spyOn(mockAuthorizationService, 'ClientCredentialsVerify').mockImplementation(() => {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CLIENT_CREDENTIALS);
      });

      await controller.token(
        body.grantType,
        body.code,
        body.redirectUri,
        body.clientId,
        body.clientSecret,
        body.provider,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.INVALID_CLIENT_CREDENTIALS });
    });
  });
});
