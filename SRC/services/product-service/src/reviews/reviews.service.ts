// src/reviews/reviews.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { Review } from './entities/reviews.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const { productId, orderId, rating } = dto;
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Điểm đánh giá phải nằm trong khoảng 1–5.');
    }

    const existing = await this.reviewRepository.findOne({ where: { userId, productId, orderId } });
    if (existing) throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi.');

    const review = this.reviewRepository.create({
      ...dto,
      userId,
      isApproved: false,
      isVisible: true,
    });

    this.logger.log(`User ${userId} created a review for product ${productId}`);
    return this.reviewRepository.save(review);
  }

  async findApprovedByProduct(productId: string) {
    return this.reviewRepository.find({
      where: { productId, isApproved: true, isVisible: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Không tìm thấy review.');
    return review;
  }

  async updateByUser(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Không tìm thấy review.');
    if (review.userId !== userId) throw new ForbiddenException('Bạn không thể chỉnh sửa review của người khác.');
    if (review.isApproved) throw new BadRequestException('Review đã được duyệt, không thể chỉnh sửa.');

    Object.assign(review, dto);
    this.logger.log(`User ${userId} updated review ID ${id}`);
    return this.reviewRepository.save(review);
  }

  async approve(id: string) {
    const review = await this.findOne(id);
    review.isApproved = true;
    this.logger.log(`Approved review ID: ${id}`);
    return this.reviewRepository.save(review);
  }

  async toggleVisibility(id: string) {
    const review = await this.findOne(id);
    review.isVisible = !review.isVisible;
    this.logger.log(`Toggled visibility for review ID: ${id}`);
    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    await this.reviewRepository.delete(id);
    this.logger.warn(`Deleted review ID: ${id}`);
    return { message: 'Đã xóa review thành công.' };
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
    isVisible?: boolean;
    productId?: string;
    userId?: string;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const where: FindOptionsWhere<Review> = {};
    if (typeof options?.isApproved === 'boolean') where.isApproved = options.isApproved;
    if (typeof options?.isVisible === 'boolean') where.isVisible = options.isVisible;
    if (options?.productId) where.productId = options.productId;
    if (options?.userId) where.userId = options.userId;

    const [items, total] = await this.reviewRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total, page, limit };
  }
}
