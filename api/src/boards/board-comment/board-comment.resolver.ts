import { Args, Context, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../../users/auth/entities/user.entitiy';
import { UseGuards } from '@nestjs/common';
import { CreateBoardCommentInput } from './dtos/create-board-comment.dto';
import { CurrentUser } from '../../users/auth/current-user.decorator';
import { UpdateBoardCommentInput } from './dtos/update-board-comment.dto';
import { BoardCommentService } from './board-comment.service';
import { BoardComment } from './entities/board-comment.entity';
import { IGraphQLContext } from '../../types/graphql.types';
import { ApiGuard } from '../../users/auth/api.guard';

@UseGuards(ApiGuard)
@Resolver(() => BoardComment)
export class BoardCommentResolver {
  constructor(private readonly commentService: BoardCommentService) {
  }

  @Mutation(() => BoardComment)
  createBoardComment(
    @Args('input') createBoardCommentInput: CreateBoardCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentService.createBoardComment(
      createBoardCommentInput,
      user,
    );
  }

  @Mutation(() => BoardComment)
  updateBoardComment(
    @Args('input') updateBoardCommentInput: UpdateBoardCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentService.updateBoardComment(
      updateBoardCommentInput,
      user,
    );
  }

  @ResolveField('user', returns => User)
  async getUser(@Parent() comment: BoardComment, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(comment.userId);
  }
}
