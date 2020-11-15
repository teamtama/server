import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserSkill } from './user-skill.entity';
import { UserSubscription } from '../user-subscription/user-subscription.entity';
import { IGraphQLContext } from '../../types/graphql.types';
import { UseGuards } from '@nestjs/common';
import { ApiGuard } from '../auth/api.guard';
import { CreateUserSkillInput } from './dtos/create-user-skill.dto';
import { UserSkillService } from './user-skill.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/entities/user.entitiy';

@Resolver(of => UserSkill)
export class UserSkillResolver {
  constructor(private readonly userSkillService: UserSkillService) {}

  @UseGuards(ApiGuard)
  @Mutation(() => String)
  createUserSkill(
    @CurrentUser() user: User,
    @Args('input') createUserSkillInput: CreateUserSkillInput,
  ) {
    return this.userSkillService.createUserSkill(user, createUserSkillInput);
  }

  @UseGuards(ApiGuard)
  @Mutation(() => String)
  deleteUserSkill(
    @CurrentUser() user: User,
    @Args('skillId') skillId: string,
  ) {
    return this.userSkillService.deleteUserSkill(user, skillId);
  }

  @ResolveField()
  skill(@Parent() userSkill: UserSkill, @Context() ctx: IGraphQLContext) {
    return ctx.skillsLoader.load(userSkill.skillId);
  }
}
