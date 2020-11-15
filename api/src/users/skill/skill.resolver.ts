import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Skill } from './skill.entitiy';
import { SkillService } from './skill.service';
import { CreateSkillInput } from './dtos/create-skill.dto';
import { UseGuards } from '@nestjs/common';
import { ApiGuard } from '../auth/api.guard';

@Resolver(of => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(ApiGuard)
  @Mutation(() => String)
  createSkill(@Args('input') createSkillInput: CreateSkillInput) {
    return this.skillService.createSkill(createSkillInput);
  }

  @Query(() => [Skill])
  getSkillList() {
    return this.skillService.getSkillList();
  }
}
