// local.strategy.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './users/auth.service';
import { UnauthorizedException } from '@nestjs/common';

// Mock the AuthService class
jest.mock('./users/auth.service');

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    // Create a spy on the `validateUser` method of the mocked AuthService
    const validateUserSpy = jest.fn();
    (AuthService as jest.Mock).mockImplementation(() => ({
      validateUser: validateUserSpy,
      // Include the validateUser method in the mock
      findOne: jest.fn(),
      create: jest.fn(),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        // Provide the AuthService token with the mocked instance
        {
          provide: AuthService,
          useValue: {
            validateUser: validateUserSpy,
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return user', async () => {
    // Set up the spy to return a mock user when called
    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'hashedpassword',
      role: '',
    };
    jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

    const result = await strategy.validate('testuser', 'testpassword');

    expect(result).toEqual(mockUser);
    expect(authService.validateUser).toHaveBeenCalledWith(
      'testuser',
      'testpassword',
    );
  });

  it('should throw UnauthorizedException if user not found', async () => {
    // Set up the spy to return null when called
    jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

    await expect(
      strategy.validate('nonexistentuser', 'invalidpassword'),
    ).rejects.toThrowError(UnauthorizedException);
    expect(authService.validateUser).toHaveBeenCalledWith(
      'nonexistentuser',
      'invalidpassword',
    );
  });

  // Add more tests for LocalStrategy as needed

  afterAll(async () => {
    // Clean up resources
  });
});
