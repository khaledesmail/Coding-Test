import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConfigService } from './database-config.service';
import { Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('DatabaseConfigService', () => {
  let service: DatabaseConfigService;

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
          entities: [Post],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Post]),
      ],
      providers: [DatabaseConfigService],
    }).compile();

    service = module.get<DatabaseConfigService>(DatabaseConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return TypeOrmModuleOptions', () => {
    const options = service.createTypeOrmOptions();
    expect(options).toBeDefined();
    // Add more assertions based on your configuration
  });
});
