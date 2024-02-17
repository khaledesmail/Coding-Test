// post.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtService } from '@nestjs/jwt';

describe('PostsService', () => {
  let service: PostsService;
  let repository: Repository<Post>;

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
          entities: [Post],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Post]),
      ],
      providers: [PostsService, JwtService],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const postId = 1;
      const result: Post = {
        id: postId,
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      } as Post;
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(postId)).toBe(result);
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
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(postData)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing post', async () => {
      const postId = 1;
      const updateData: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        author: 'Updated Author',
      };
      const updateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      }; // Mock UpdateResult
      const result: Post = {
        id: postId,
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      } as Post;
      jest.spyOn(repository, 'update').mockResolvedValue(updateResult);
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);
      expect(await service.update(postId, updateData)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete an existing post', async () => {
      const postId = 1;
      const deleteResult: DeleteResult = { affected: 1, raw: {} }; // Mock DeleteResult
      const result: Post = {
        id: postId,
        title: 'Title 1',
        content: 'Content 1',
        author: 'Author 1',
      } as Post;
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);
      expect(await service.remove(postId)).toBe(result);
    });
  });
});
