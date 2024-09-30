import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserService } from '../../../src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { createTestUser } from '../../factories/user.factory';
import { createTestModule } from '../../test.module';
import { UserController } from '@/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities';


describe('UserController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await (await createTestModule({
      controllers: [UserController],
      providers: [UserService],
      imports: []
    }))
    .compile();
    
    app = moduleFixture.createNestApplication();
    jwtService = app.get<JwtService>(JwtService);
    await app.init();

    const userService = app.get<UserService>(UserService);
    const user = await createTestUser(userService);

    const payload = { sub: user.userId };
    accessToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/info (GET)', async () => {
    return request(app.getHttpServer())
      .get('/user/info')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.email).toBe('test@gmail.com');
        expect(response.body.name).toBe('TestUser');
        expect(typeof response.body.userId).toBe('string');
        expect(response.body.userLogo).toBe('https://example.com/user.png');
      })
  });
});
