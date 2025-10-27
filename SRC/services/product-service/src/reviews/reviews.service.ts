import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { Product } from '../products/entities/product.entity';
import axios from 'axios';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Kiểm tra xem user đã mua sản phẩm này và order đã completed chưa
   */
  private async verifyUserPurchase(
    userId: string,
    productId: string,
    orderId: string,
  ): Promise<boolean> {
    try {
      // Gọi sang order-service để verify
      const orderServiceUrl =
        process.env.ORDER_SERVICE_URL || 'http://order_service:3004';
      const response = await axios.get(
        `${orderServiceUrl}/orders/${orderId}/verify-product`,
        {
          params: { userId, productId },
          timeout: 5000,
        },
      );

      return response.data.isValid && response.data.status === 'completed';
    } catch (error) {
      console.error('Error verifying user purchase:', error.message);
      return false;
    }
  }

  /**
   * Tạo đánh giá mới
   */
  async createReview(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { productId, orderId, rating, comment, images } = createReviewDto;

    // Kiểm tra product có tồn tại không
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Kiểm tra user đã mua sản phẩm chưa
    const hasPurchased = await this.verifyUserPurchase(
      userId,
      productId,
      orderId,
    );
    if (!hasPurchased) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và đơn hàng đã hoàn thành',
      );
    }

    // Kiểm tra đã review chưa
    const existingReview = await this.reviewRepository.findOne({
      where: { userId, productId, orderId },
    });
    if (existingReview) {
      throw new BadRequestException(
        'Bạn đã đánh giá sản phẩm này cho đơn hàng này rồi',
      );
    }

    // Tạo review mới
    const review = this.reviewRepository.create({
      userId,
      productId,
      orderId,
      rating,
      comment,
      images: images || [],
      isApproved: false, // Admin cần duyệt
      isVisible: true,
    });

    return this.reviewRepository.save(review);
  }

  /**
   * Lấy danh sách reviews với filter và phân trang
   */
  async getReviews(queryDto: QueryReviewDto) {
    const {
      productId,
      userId,
      rating,
      isApproved,
      isVisible,
      page,
      limit,
      sortBy,
      order,
    } = queryDto;

    const queryBuilder = this.reviewRepository.createQueryBuilder('review');

    // Apply filters
    if (productId) {
      queryBuilder.andWhere('review.productId = :productId', { productId });
    }
    if (userId) {
      queryBuilder.andWhere('review.userId = :userId', { userId });
    }
    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }
    if (isApproved !== undefined) {
      queryBuilder.andWhere('review.isApproved = :isApproved', { isApproved });
    }
    if (isVisible !== undefined) {
      queryBuilder.andWhere('review.isVisible = :isVisible', { isVisible });
    }

    // Sort
    queryBuilder.orderBy(`review.${sortBy}`, order);

    // Pagination
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const skip = (currentPage - 1) * currentLimit;
    queryBuilder.skip(skip).take(currentLimit);

    // Execute query
    const [reviews, total] = await queryBuilder.getManyAndCount();

    // Lấy thông tin user từ user-service (optional, có thể cache)
    const reviewsWithUserInfo = await Promise.all(
      reviews.map(async (review) => {
        try {
          const userInfo = await this.getUserInfo(review.userId);
          return {
            ...review,
            userName: userInfo?.name || 'Người dùng',
            userAvatar: userInfo?.avatar || null,
          };
        } catch {
          return {
            ...review,
            userName: 'Người dùng',
            userAvatar: null,
          };
        }
      }),
    );

    return {
      reviews: reviewsWithUserInfo,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
    };
  }

  /**
   * Lấy reviews của một sản phẩm (cho public)
   */
  async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    return this.getReviews({
      productId,
      isApproved: true,
      isVisible: true,
      page,
      limit,
      sortBy: 'createdAt',
      order: 'DESC',
    });
  }

  /**
   * Lấy thống kê rating của sản phẩm
   */
  async getProductRatingStats(productId: string) {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .addSelect('COUNT(CASE WHEN review.rating = 5 THEN 1 END)', 'fiveStars')
      .addSelect('COUNT(CASE WHEN review.rating = 4 THEN 1 END)', 'fourStars')
      .addSelect('COUNT(CASE WHEN review.rating = 3 THEN 1 END)', 'threeStars')
      .addSelect('COUNT(CASE WHEN review.rating = 2 THEN 1 END)', 'twoStars')
      .addSelect('COUNT(CASE WHEN review.rating = 1 THEN 1 END)', 'oneStar')
      .where('review.productId = :productId', { productId })
      .andWhere('review.isVisible = :isVisible', { isVisible: true })
      .andWhere('review.isApproved = :isApproved', { isApproved: true })
      .getRawOne();

    return {
      averageRating: parseFloat(result.averageRating) || 0,
      totalReviews: parseInt(result.totalReviews) || 0,
      ratingDistribution: {
        5: parseInt(result.fiveStars) || 0,
        4: parseInt(result.fourStars) || 0,
        3: parseInt(result.threeStars) || 0,
        2: parseInt(result.twoStars) || 0,
        1: parseInt(result.oneStar) || 0,
      },
    };
  }

  /**
   * Lấy một review theo ID
   */
  async getReviewById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Đánh giá không tồn tại');
    }
    return review;
  }

  /**
   * Cập nhật review (user chỉ có thể update review của mình)
   */
  async updateReview(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.getReviewById(id);

    // Kiểm tra ownership
    if (review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    // User không thể tự approve review của mình
    if (updateReviewDto.isApproved !== undefined) {
      delete updateReviewDto.isApproved;
    }

    Object.assign(review, updateReviewDto);
    review.updatedAt = new Date();

    // Nếu user sửa review, cần admin duyệt lại
    review.isApproved = false;

    return this.reviewRepository.save(review);
  }

  /**
   * Admin cập nhật review (có thể approve, hide, etc.)
   */
  async adminUpdateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.getReviewById(id);

    Object.assign(review, updateReviewDto);
    review.updatedAt = new Date();

    return this.reviewRepository.save(review);
  }

  /**
   * Xóa review (chỉ user sở hữu hoặc admin)
   */
  async deleteReview(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const review = await this.getReviewById(id);

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    await this.reviewRepository.remove(review);
  }

  /**
   * Kiểm tra user đã review product trong order chưa
   */
  async hasUserReviewed(
    userId: string,
    productId: string,
    orderId: string,
  ): Promise<boolean> {
    const review = await this.reviewRepository.findOne({
      where: { userId, productId, orderId },
    });
    return !!review;
  }

  /**
   * Lấy thông tin user từ user-service
   */
  private async getUserInfo(userId: string): Promise<any> {
    try {
      const userServiceUrl =
        process.env.USER_SERVICE_URL || 'http://user_service:3001';
      const response = await axios.get(`${userServiceUrl}/api/users/${userId}`, {
        timeout: 3000,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error.message);
      return null;
    }
  }

  /**
   * Admin - Lấy tất cả reviews (có filter và pagination)
   */
  async adminGetAllReviews(queryDto: QueryReviewDto) {
    return this.getReviews(queryDto);
  }

  /**
   * Admin - Duyệt nhiều reviews cùng lúc
   */
  async adminBulkApprove(reviewIds: string[]): Promise<void> {
    await this.reviewRepository
      .createQueryBuilder()
      .update(Review)
      .set({ isApproved: true })
      .whereInIds(reviewIds)
      .execute();
  }

  /**
   * Admin - Ẩn nhiều reviews cùng lúc
   */
  async adminBulkHide(reviewIds: string[]): Promise<void> {
    await this.reviewRepository
      .createQueryBuilder()
      .update(Review)
      .set({ isVisible: false })
      .whereInIds(reviewIds)
      .execute();
  }

  /**
   * Admin - Xóa nhiều reviews cùng lúc
   */
  async adminBulkDelete(reviewIds: string[]): Promise<void> {
    await this.reviewRepository
      .createQueryBuilder()
      .delete()
      .from(Review)
      .whereInIds(reviewIds)
      .execute();
  }
}

