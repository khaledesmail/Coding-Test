import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import SwaggerModule and DocumentBuilder
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PostsModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
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
      include: [PostsModule, UsersModule, AuthModule], // Include your modules here
    });

    SwaggerModule.setup('api', app, document);
  }
}
