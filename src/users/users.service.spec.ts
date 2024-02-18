// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

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
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const result: User = {
        id: 1,
        username: 'testuser',
        password: 'testpassword',
        role: 'reader',
      } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(username)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'newpassword',
        role: 'writer', // Specify the role in the DTO
      };
      const createdUser: User = {
        id: 2,
        ...createUserDto,
      } as User;
      jest.spyOn(repository, 'create').mockReturnValueOnce(createdUser);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(createdUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toBe(createdUser);
    });
  });
});
