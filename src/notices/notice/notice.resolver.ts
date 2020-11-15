import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Notice } from './notice.entitiy';
import { CreateNoticeInput } from './dtos/create-notice.dto';
import { User } from '../../users/auth/entities/user.entitiy';
import { NoticeService } from './notice.service';
import { AdminUser } from '../../users/auth/admin-user.decorator';
import { UseGuards } from '@nestjs/common';
import { IGraphQLContext } from '../../types/graphql.types';
import { GetNoticeListFilter, GetNoticeListOutput } from './dtos/get-notice-list.dto';
import { UpdateNoticeInput } from './dtos/update-notice.dto';
import { GraphQLUpload } from 'apollo-server-express';
import { FileUpload } from 'graphql-upload';
import { ApiGuard } from '../../users/auth/api.guard';
import { Public } from '../../common/decorators/public.decorator';

@UseGuards(ApiGuard)
@Resolver(() => Notice)
export class NoticeResolver {
  constructor(private noticeService: NoticeService) {
  }

  @Mutation((type) => Notice)
  createNotice(
    @Args('input') createNoticeInput: CreateNoticeInput,
    @AdminUser() user: User,
  ) {
    return this.noticeService.createNotice(createNoticeInput, user);
  }

  @Mutation((type) => Notice)
  updateNotice(
    @Args('input') updateNoticeInput: UpdateNoticeInput,
    @AdminUser() user: User,
  ) {
    return this.noticeService.updateNotice(updateNoticeInput, user);
  }

  @Public()
  @Query((type) => GetNoticeListOutput)
  getNoticeList(
    @Args({ nullable: true })
      getNoticeListFilter: GetNoticeListFilter,
  ) {
    console.log(getNoticeListFilter);
    return this.noticeService.getNoticeList(getNoticeListFilter);
  }

  @Public()
  @Query((type) => Notice)
  getNotice(@Args('noticeId') noticeId: string) {
    return this.noticeService.getNotice(noticeId);
  }

  @Mutation((type) => Notice)
  deleteNotice(@Args('noticeId') noticeId: string, @AdminUser() user: User) {
    return this.noticeService.deleteNotice(noticeId, user);
  }

  @Mutation(() => String)
  uploadNoticeImage(
    @Args('noticeId') noticeId: string,
    @Args({ name: 'file', type: () => GraphQLUpload })
      file: FileUpload,
  ) {
    return this.noticeService.uploadImage(noticeId, file);
  }

  @ResolveField('user', (returns) => User)
  async getUser(@Parent() notice: Notice, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(notice.userId);
  }
}
