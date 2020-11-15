import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CursorPagination } from '../../../common/dtos/CursorPagination.dto';
import { Notice, NoticeCategory } from '../notice.entitiy';

@ArgsType()
export class GetNoticeListFilter {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  after: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  first: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  keyword: string;

  @Field(() => NoticeCategory, { defaultValue: NoticeCategory.NOTICE })
  @IsOptional()
  @IsEnum(NoticeCategory)
  category: NoticeCategory;
}

@ObjectType()
export class GetNoticeListOutput extends CursorPagination(Notice) {}
