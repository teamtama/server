import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LikeArgs } from './dtos/like.dto';
import { User } from '../../users/auth/entities/user.entitiy';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardLike } from './entities/board-like.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class BoardLikeService {
  constructor(
    @InjectRepository(BoardLike)
    private readonly likeRepository: Repository<BoardLike>,
  ) {}

  async findAllById(boardId: string) {
    try {
      return await this.likeRepository.find({ where: { boardId } });
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async like({ boardId }: LikeArgs, user: User) {
    try {
      const query = this.likeRepository.createQueryBuilder();

      const found = await query
        .select()
        .andWhere('boardId = :boardId', { boardId })
        .andWhere('userId = :userId', { userId: user.id })
        .getOne();

      if (found) {
        throw new ConflictException();
      }

      await query
        .insert()
        .into(BoardLike)
        .values({
          user,
          boardId,
        })
        .execute();
      return boardId;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async unlike({ boardId }: LikeArgs, user: User) {
    try {
      const query = this.likeRepository.createQueryBuilder();

      const found = await query
        .select()
        .andWhere('boardId = :boardId', { boardId })
        .andWhere('userId = :userId', { userId: user.id })
        .getOne();

      if (!found) {
        throw new NotFoundException();
      }

      console.log(found);

      await query
        .delete()
        .from(BoardLike)
        .andWhere('boardId = :boardId', { boardId })
        .andWhere('userId = :userId', { userId: user.id })
        .execute();
      return boardId;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
