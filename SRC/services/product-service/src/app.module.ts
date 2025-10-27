// src/app.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // Import CacheModule from @nestjs/cache-manager
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CakeOptionsModule } from './cake-options/cake-options.module';
import { Category } from './categories/entities/category.entity'; // Import entity
import { Product } from './products/entities/product.entity';     // Import entity
import { Review } from './reviews/entities/review.entity';        // Import entity
import { CakeOption } from './cake-options/entities/cake-option.entity'; // Import entity
import * as redisStore from 'cache-manager-redis-store'; // Import redis store
import { AuthModule } from './auth/auth.module'; // <<< IMPORT AUTHMODULE MỚI TẠO

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Cấu hình TypeORM (tương tự user-service, nhưng thêm entities mới)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DATABASE_HOST')!,
        port: parseInt(configService.get<string>('DATABASE_PORT', '5432')!, 10),
        username: configService.get<string>('DATABASE_USER')!,
        password: configService.get<string>('DATABASE_PASSWORD')!,
        database: configService.get<string>('DATABASE_NAME')!,
        entities: [Category, Product, Review, CakeOption],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
        // Force UTF-8 encoding for PostgreSQL
        options: {
          'client_encoding': 'UTF8',
        },
        extra: {
          options: '-c client_encoding=UTF8',
        },
      }),
    }),

    // --- CẤU HÌNH CACHE MODULE ---
    CacheModule.registerAsync({
      isGlobal: true, // Đặt global để dễ sử dụng ở mọi nơi
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore, // Chỉ định dùng redisStore
        host: configService.get<string>('REDIS_HOST')!, // Lấy từ env
        port: parseInt(configService.get<string>('REDIS_PORT')!, 10), // Lấy từ env
        ttl: configService.get<number>('CACHE_TTL', 60), // Thời gian sống mặc định (giây), ví dụ 60s
      }),
    }),

    // Import các feature modules
    AuthModule,
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    CakeOptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}