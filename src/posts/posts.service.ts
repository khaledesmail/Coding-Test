import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async findAll() {
    try {
      return await this.postRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(`Unable to fetch posts: ${error}`);
    }
  }
  async findOne(id: number) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return post;
    } catch (error) {
      throw new InternalServerErrorException(`Unable to fetch post: ${error}`);
    }
  }
  async create(createPostDto: CreatePostDto) {
    try {
      const post = this.postRepository.create(createPostDto);
      return await this.postRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(`Unable to create post: ${error}`);
    }
  }
  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      await this.postRepository.update(id, updatePostDto);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(`Unable to update post: ${error}`);
    }
  }
  async remove(id: number) {
    try {
      const post = await this.findOne(id);
      await this.postRepository.delete(id);
      return post;
    } catch (error) {
      throw new InternalServerErrorException(`Unable to delete post: ${error}`);
    }
  }
}
