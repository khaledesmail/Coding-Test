import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  content: string;

  @Column()
  @ApiProperty()
  author: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  timestamp: Date;
}
