// jwt.strategy.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;
  let userService: UsersService;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test'; // Set NODE_ENV to 'test'

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          // Your testing database configuration
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'test-post',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mock-secret'), // Provide a mock value for JWT_SECRET during testing
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return user', async () => {
      const mockPayload = { username: 'testuser' };
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: '',
      };
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const mockPayload = { username: 'nonexistentuser' };

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
