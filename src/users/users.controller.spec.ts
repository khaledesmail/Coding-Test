// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should list all  user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'newpassword',
        role: 'writer', // Specify the role in the DTO
      };
      const createdUser: User = {
        id: 2,
        ...createUserDto,
      } as User;
      jest.spyOn(service, 'create').mockResolvedValueOnce(createdUser);

      const result = await controller.register(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe(createdUser);
    });
  });

  afterAll(async () => {
    // Clean up resources
  });
});
