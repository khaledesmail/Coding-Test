import { Test, TestingModule } from '@nestjs/testing';
import { PostsModule } from './posts.module';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Connection } from 'typeorm';

describe('PostsModule', () => {
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
          entities: [Post],
        }),
        PostsModule,
      ],
    }).compile();

    connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import TypeOrmModule with Post entity', () => {
    const entityMetadata = connection.entityMetadatas.find(
      (metadata) => metadata.target === Post,
    );

    expect(entityMetadata).toBeDefined();
  });

  it('should correctly import and provide PostsService', () => {
    const postsService = module.get<PostsService>(PostsService);

    expect(postsService).toBeInstanceOf(PostsService);
  });

  it('should correctly import and provide PostsController', () => {
    const postsController = module.get<PostsController>(PostsController);

    expect(postsController).toBeInstanceOf(PostsController);
  });

  // Add more tests as needed

  afterAll(async () => {
    await module.close();
  });
});
