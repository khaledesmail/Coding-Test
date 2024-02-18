// post.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

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
      controllers: [PostsController],
      providers: [PostsService, JwtService],
    }).compile();
    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result: Post[] = [
        {
          id: 1,
          title: 'Title 1',
          content: 'Content 1',
          author: 'Author 1',
        } as Post,
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const postId = '1';
      const result: Post = {
        id: parseInt(postId),
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      } as Post;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(postId)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const postData: CreatePostDto = {
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      };
      const result: Post = { id: 1, ...postData } as Post;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(postData)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing post', async () => {
      const postId = '1';
      const updateData: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        author: 'Updated Author',
      };
      const result: Post = { id: parseInt(postId), ...updateData } as Post;
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(postId, updateData)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove an existing post', async () => {
      const postId = '1';
      const result: Post = {
        id: parseInt(postId),
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      } as Post;
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(postId)).toBe(result);
    });
  });
});
