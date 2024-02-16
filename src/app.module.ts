import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import SwaggerModule and DocumentBuilder

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER || 'your_username',
      password: process.env.POSTGRES_PASSWORD || 'your_password',
      database: process.env.POSTGRES_DB || 'your_database_name',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // Add a method to initialize Swagger documentation
  static initializeSwagger(app) {
    const options = new DocumentBuilder()
      .setTitle('Posts CRUD API')
      .setDescription('API documentation for the Posts CRUD API')
      .setVersion('1.0')
      .addTag('posts') // Add a tag for your posts module
      .build();

    const document = SwaggerModule.createDocument(app, options, {
      include: [PostsModule], // Include your modules here
    });

    SwaggerModule.setup('api', app, document);
  }
}
