import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModuleOptions, getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@nestjs/common';
import { beforeAll, afterAll } from '@jest/globals';

const testDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test_user',
  password: 'test_password',
  database: 'test_database',
  synchronize: true,
  dropSchema: true,
  entities: ['dist/**/*.entity{.ts,.js}'], // Adjust the path based on your project structure
};

let app: TestingModule;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testDbOptions),
      // Include other necessary modules for testing
    ],
  }).compile();
});

afterAll(async () => {
  // Close the application and cleanup
  await app.close();
});

// Helper function to clear the database before each test
export const clearDatabase = async () => {
  const connection = app.get(getRepositoryToken(Post)).getRepository()
    .target as any;
  const entities = connection.options.entities;
  const promises = entities.map((entity: any) =>
    connection.query(`DELETE FROM ${entity.tableName}`),
  );
  await Promise.all(promises);
};
