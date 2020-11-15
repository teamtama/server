import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSkill } from './user-skill.entity';
import { Repository } from 'typeorm';
import { CreateUserSkillInput } from './dtos/create-user-skill.dto';
import { User } from '../auth/entities/user.entitiy';
import { SkillService } from '../skill/skill.service';

@Injectable()
export class UserSkillService {
  constructor(
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
    private readonly skillService: SkillService,
  ) {}

  async getUserSkillList() {
    try {
      return await this.userSkillRepository.find();
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  async createUserSkill(
    user: User,
    createUserSkillInput: CreateUserSkillInput,
  ) {
    try {
      // 스킬을 찾는다.
      const existingSkill = await this.skillService.findSkill(
        createUserSkillInput.skillId,
      );
      if (!existingSkill) {
        throw new NotFoundException('스킬이 존재하지않습니다. ');
      }

      // 중간테이블에서 해당 유저와 해당 스킬이 존재하는지 찾는다.
      const found = await this.userSkillRepository.findOne({
        where: {
          skillId: createUserSkillInput.skillId,
          userId: user.id,
        },
      });
      if (found) {
        throw new ConflictException('이미 존재합니다.');
      }

      // 존재하지 않는다면 중간테이블을 생성한다.
      const result = await this.userSkillRepository
        .createQueryBuilder()
        .insert()
        .values({
          skillId: createUserSkillInput.skillId,
          userId: user.id,
        })
        .execute();
      console.log(result);
      return 'success';
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  async deleteUserSkill(user: User, skillId: string) {
    try {
      // 중간테이블에서 해당 유저와 해당 스킬이 존재하는지 찾는다.
      const found = await this.userSkillRepository.findOne({
        where: {
          skillId,
          userId: user.id,
        },
      });
      if (!found) {
        throw new ConflictException('존재하지않는 스킬입니다.');
      }
      const query = this.userSkillRepository.createQueryBuilder();
      await query
        .delete()
        .from(UserSkill)
        .where('userId = :userId', { userId: user.id })
        .andWhere('skillId = :skillId', { skillId })
        .execute();
      return 'success';
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
