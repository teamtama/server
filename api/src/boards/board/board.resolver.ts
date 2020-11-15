import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CreateBoardInput } from './dtos/create-board.dto';
import { GetBoardListFilter, GetBoardListOutput } from './dtos/get-board-list.dto';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../users/auth/current-user.decorator';
import { User } from '../../users/auth/entities/user.entitiy';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { UpdateBoardInput } from './dtos/update-board.dto';
import { DeleteBoardArgs } from './dtos/delete-board.dto';
import { IGraphQLContext } from '../../types/graphql.types';
import { BoardLike } from '../board-like/entities/board-like.entitiy';
import { BoardComment } from '../board-comment/entities/board-comment.entity';
import { FileUpload } from 'graphql-upload';
import { GraphQLUpload } from 'apollo-server-express';
import { ApiGuard } from '../../users/auth/api.guard';
import { Public } from '../../common/decorators/public.decorator';

@UseGuards(ApiGuard)
@Resolver(() => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {
  }

  @Public()
  @Query(() => GetBoardListOutput)
  getBoardList(
    @Args() getBoardListFilter: GetBoardListFilter,
  ): Promise<GetBoardListOutput> {
    console.log(getBoardListFilter.category === 0);
    return this.boardService.getBoardList(getBoardListFilter);
  }

  @Public()
  @Query(() => Board)
  getBoard(@Args('boardId') boardId: string): Promise<Board> {
    return this.boardService.getBoard(boardId);
  }

  @Mutation(() => Board)
  createBoard(
    @Args('input') createBoardInput: CreateBoardInput,
    @CurrentUser() user: User,
  ): Promise<Board> {
    return this.boardService.createBoard(createBoardInput, user);
  }

  @Mutation(() => Board)
  updateBoard(
    @Args('input') updateBoardInput: UpdateBoardInput,
    @CurrentUser() user: User,
  ) {
    return this.boardService.updateBoard(updateBoardInput, user);
  }

  @Mutation(() => String)
  deleteBoard(
    @Args() deleteBoardArgs: DeleteBoardArgs,
    @CurrentUser() user: User,
  ) {
    return this.boardService.deleteBoard(deleteBoardArgs, user);
  }

  @ResolveField('user', (returns) => User)
  async getUser(@Parent() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(board.userId);
  }

  @ResolveField('likes', (returns) => [BoardLike])
  async getLikes(@Parent() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.boardLikeLoader.load(board.id);
  }

  @ResolveField('comments', (returns) => [BoardComment])
  async getComments(@Parent() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.boardCommentLoader.load(board.id);
  }
}
