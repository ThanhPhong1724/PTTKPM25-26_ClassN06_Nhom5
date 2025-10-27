import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ============================================================================
  // PUBLIC ENDPOINTS
  // ============================================================================

  /**
   * Lấy reviews của một sản phẩm (public)
   * GET /api/reviews/products/:productId
   */
  @Public()
  @Get('products/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewsService.getProductReviews(
      productId,
      Number(page),
      Number(limit),
    );
  }

  /**
   * Lấy thống kê rating của sản phẩm (public)
   * GET /api/reviews/products/:productId/stats
   */
  @Public()
  @Get('products/:productId/stats')
  async getProductRatingStats(@Param('productId') productId: string) {
    return this.reviewsService.getProductRatingStats(productId);
  }

  // ============================================================================
  // USER ENDPOINTS (Require Authentication)
  // ============================================================================

  /**
   * Tạo review mới
   * POST /api/reviews
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(
    @Request() req,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const userId = req.user.userId;
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  /**
   * Lấy reviews của user hiện tại
   * GET /api/reviews/my-reviews
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  async getMyReviews(
    @Request() req,
    @Query() queryDto: QueryReviewDto,
  ) {
    const userId = req.user.userId;
    return this.reviewsService.getReviews({
      ...queryDto,
      userId,
    });
  }

  /**
   * Kiểm tra user đã review sản phẩm trong order chưa
   * GET /api/reviews/check/:productId/:orderId
   */
  @UseGuards(JwtAuthGuard)
  @Get('check/:productId/:orderId')
  async checkUserReviewed(
    @Request() req,
    @Param('productId') productId: string,
    @Param('orderId') orderId: string,
  ) {
    const userId = req.user.userId;
    const hasReviewed = await this.reviewsService.hasUserReviewed(
      userId,
      productId,
      orderId,
    );
    return { hasReviewed };
  }

  /**
   * Cập nhật review của user
   * PUT /api/reviews/:id
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateReview(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const userId = req.user.userId;
    return this.reviewsService.updateReview(id, userId, updateReviewDto);
  }

  /**
   * Xóa review của user
   * DELETE /api/reviews/:id
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.reviewsService.deleteReview(id, userId, false);
  }

  // ============================================================================
  // ADMIN ENDPOINTS (Require Admin Role)
  // ============================================================================

  /**
   * Admin - Lấy tất cả reviews với filter
   * GET /api/reviews/admin/all
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/all')
  async adminGetAllReviews(@Query() queryDto: QueryReviewDto) {
    return this.reviewsService.adminGetAllReviews(queryDto);
  }

  /**
   * Admin - Lấy một review theo ID
   * GET /api/reviews/admin/:id
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/:id')
  async adminGetReview(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  /**
   * Admin - Cập nhật review (approve, hide, etc.)
   * PUT /api/reviews/admin/:id
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('admin/:id')
  async adminUpdateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.adminUpdateReview(id, updateReviewDto);
  }

  /**
   * Admin - Xóa review
   * DELETE /api/reviews/admin/:id
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async adminDeleteReview(@Param('id') id: string) {
    await this.reviewsService.deleteReview(id, '', true);
  }

  /**
   * Admin - Duyệt nhiều reviews
   * POST /api/reviews/admin/bulk-approve
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/bulk-approve')
  @HttpCode(HttpStatus.OK)
  async adminBulkApprove(@Body() body: { reviewIds: string[] }) {
    await this.reviewsService.adminBulkApprove(body.reviewIds);
    return { message: 'Đã duyệt reviews thành công' };
  }

  /**
   * Admin - Ẩn nhiều reviews
   * POST /api/reviews/admin/bulk-hide
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/bulk-hide')
  @HttpCode(HttpStatus.OK)
  async adminBulkHide(@Body() body: { reviewIds: string[] }) {
    await this.reviewsService.adminBulkHide(body.reviewIds);
    return { message: 'Đã ẩn reviews thành công' };
  }

  /**
   * Admin - Xóa nhiều reviews
   * POST /api/reviews/admin/bulk-delete
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/bulk-delete')
  @HttpCode(HttpStatus.OK)
  async adminBulkDelete(@Body() body: { reviewIds: string[] }) {
    await this.reviewsService.adminBulkDelete(body.reviewIds);
    return { message: 'Đã xóa reviews thành công' };
  }
}

