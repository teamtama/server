import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './skill.entitiy';
import { Repository } from 'typeorm';
import { CreateSkillInput } from './dtos/create-skill.dto';
import { UpdateSkillInput } from './dtos/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async getSkillList() {
    try {
      return await this.skillRepository.find();
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  async findSkill(skillId: string) {
    try {
      const found = await this.skillRepository.findOne({
        where: {
          id: skillId,
        },
      });
      if (!found) {
        throw new NotFoundException('해당 스킬이 존재하지 않습니다.');
      }
      return found;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  async createSkill(createSkillInput: CreateSkillInput) {
    try {
      const found = await this.skillRepository.findOne({
        where: {
          name: createSkillInput.name,
        },
      });
      if (found) {
        return found.id;
      }
      const result = await this.skillRepository
        .createQueryBuilder('skill')
        .insert()
        .values({
          ...createSkillInput,
        })
        .execute();
      return result.raw.insertId;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  async updateSkill(updateSkillInput: UpdateSkillInput) {
    try {
      const result = await this.skillRepository
        .createQueryBuilder('skill')
        .update(Skill)
        .set({
          ...updateSkillInput,
        })
        .where('skill.id = :id', { id: updateSkillInput.skillId })
        .execute();
      console.log(result);
      return 'success';
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
