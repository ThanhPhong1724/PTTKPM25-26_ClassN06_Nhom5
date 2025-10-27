import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CakeOptionsController } from './cake-options.controller';
import { CakeOptionsService } from './cake-options.service';
import { CakeOption } from './entities/cake-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CakeOption])],
  controllers: [CakeOptionsController],
  providers: [CakeOptionsService],
  exports: [CakeOptionsService],
})
export class CakeOptionsModule {}

