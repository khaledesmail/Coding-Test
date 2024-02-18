import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Connection } from 'typeorm';

describe('UsersModule', () => {
  let module: TestingModule;
  let connection: Connection;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'test-post',
          synchronize: true,
          entities: [User],
        }),
        UsersModule,
      ],
    }).compile();

    connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import TypeOrmModule with User entity', () => {
    const entityMetadata = connection.entityMetadatas.find(
      (metadata) => metadata.target === User,
    );

    expect(entityMetadata).toBeDefined();
  });

  it('should correctly import and provide UsersService', () => {
    const usersService = module.get<UsersService>(UsersService);

    expect(usersService).toBeInstanceOf(UsersService);
  });

  it('should correctly import and provide UsersController', () => {
    const usersController = module.get<UsersController>(UsersController);

    expect(usersController).toBeInstanceOf(UsersController);
  });

  // Add more tests as needed

  afterAll(async () => {
    await module.close();
  });
});
