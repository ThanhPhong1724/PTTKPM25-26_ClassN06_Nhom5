// src/reviews/reviews.controller.ts
import {
  Controller, Get, Post, Patch, Delete, Body, Param, Request,
  ParseUUIDPipe, ValidationPipe, UseGuards, HttpCode, HttpStatus,
  Logger, Query, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('reviews')
export class ReviewsController {
  private readonly logger = new Logger(ReviewsController.name);

  constructor(private readonly reviewsService: ReviewsService) {}

  // --- HEALTH CHECK ---
  @Get('health')
  @HttpCode(HttpStatus.OK)
  checkHealth() {
    return { status: 'ok', service: 'reviews-service' };
  }

  // --- USER: Gửi đánh giá ---
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createDto: CreateReviewDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    this.logger.log(`User ${userId} is creating review for product ${createDto.productId}`);
    return this.reviewsService.create(userId, createDto);
  }

  // --- USER: Xem review đã duyệt của sản phẩm ---
  @Get('product/:productId')
  async findApprovedByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.reviewsService.findApprovedByProduct(productId);
  }

  // --- USER: Cập nhật review (chưa duyệt) ---
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateDto: UpdateReviewDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.reviewsService.updateByUser(id, userId, updateDto);
  }

  // --- ADMIN: Xem tất cả review (phân trang + filter) ---
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/all')
  async findAllAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isApproved') isApproved?: string,
    @Query('isVisible') isVisible?: string,
    @Query('productId') productId?: string,
    @Query('userId') userId?: string,
  ) {
    const opts = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      isApproved: isApproved ? isApproved === 'true' : undefined,
      isVisible: isVisible ? isVisible === 'true' : undefined,
      productId,
      userId,
    };
    this.logger.log(`Admin fetching reviews with options: ${JSON.stringify(opts)}`);
    return this.reviewsService.findAll(opts);
  }

  // --- ADMIN: Xem chi tiết 1 review ---
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/:id')
  async findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Admin fetching review ID: ${id}`);
    return this.reviewsService.findOne(id);
  }

  // --- ADMIN: Duyệt review ---
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/:id/approve')
  async approve(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Admin approving review ID: ${id}`);
    return this.reviewsService.approve(id);
  }

  // --- ADMIN: Toggle hiển thị ---
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/:id/toggle-visibility')
  async toggleVisibility(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Admin toggling visibility for review ID: ${id}`);
    return this.reviewsService.toggleVisibility(id);
  }

  // --- ADMIN: Xóa review ---
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.warn(`Admin deleting review ID: ${id}`);
    return this.reviewsService.remove(id);
  }
}
