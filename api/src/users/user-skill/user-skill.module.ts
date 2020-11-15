import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSkill } from './user-skill.entity';
import { UserSkillService } from './user-skill.service';
import { UserSkillResolver } from './user-skill.resolver';
import { SkillModule } from '../skill/skill.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSkill]), SkillModule],
  providers: [UserSkillService, UserSkillResolver]
})
export class UserSkillModule {}
