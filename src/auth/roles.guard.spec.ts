import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
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
          database: 'test-post',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        RolesGuard,
        Reflector,
        JwtService, // Add JwtService to the providers array
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are specified', () => {
    const context = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({}),
    } as any;
    jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'admin' });
    jest.spyOn(reflector, 'get').mockReturnValue(null);
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny access when token is not provided', () => {
    const roles = ['admin'];
    const context = {
      getHandler: jest.fn(() => roles),
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({ headers: {} }),
    } as any;
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const result = guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should deny access when user role is not defined', () => {
    const roles = ['admin'];
    const context = {
      getHandler: jest.fn(() => roles),
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest
        .fn()
        .mockReturnValue({ headers: { authorization: 'Bearer token' } }),
    } as any;
    jest.spyOn(jwtService, 'verify').mockReturnValue({});
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const result = guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should allow access when user role is included in specified roles', () => {
    const roles = ['admin'];
    const context = {
      getHandler: jest.fn(() => roles),
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest
        .fn()
        .mockReturnValue({ headers: { authorization: 'Bearer token' } }),
    } as any;
    jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'admin' });
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny access when user role is not included in specified roles', () => {
    const roles = ['admin'];
    const context = {
      getHandler: jest.fn(() => roles),
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest
        .fn()
        .mockReturnValue({ headers: { authorization: 'Bearer token' } }),
    } as any;
    jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'user' });
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const result = guard.canActivate(context);
    expect(result).toBe(false);
  });
});
