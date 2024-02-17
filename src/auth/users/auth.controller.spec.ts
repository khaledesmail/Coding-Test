// auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

jest.mock('bcrypt');

describe.only('AuthService', () => {
  let controller: AuthController;
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          // Your testing database configuration
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'posts',
          entities: [Post],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Post]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'testpassword',
        role: '',
      };
      jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

      const result = await controller.register({ body: mockUser });
      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'testpassword',
        role: '',
      };
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ access_token: 'mock_token' });

      const result = await controller.login({ body: mockUser });
      expect(result).toEqual({ access_token: 'mock_token' });
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
