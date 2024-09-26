import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    try {
      return await this.postsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Unable to fetch posts');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'editor', 'reader'])
  async findOne(@Param('id') id: string) {
    try {
      return await this.postsService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Unable to fetch post');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'editor'])
  async create(@Body() createPostDto: CreatePostDto) {
    try {
      return await this.postsService.create(createPostDto);
    } catch (error) {
      throw new InternalServerErrorException('Unable to create post');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'editor'])
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    try {
      return await this.postsService.update(+id, updatePostDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Unable to update post');
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async remove(@Param('id') id: string) {
    try {
      return await this.postsService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Unable to delete post');
    }
  }
}
