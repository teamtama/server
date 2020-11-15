import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../../users/auth/entities/user.entitiy';

export enum NoticeCategory {
  NOTICE,
  EVENT,
}

registerEnumType(NoticeCategory, {
  name: 'NoticeCategory',
});

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Notice extends CoreEntity {
  @Field(() => NoticeCategory)
  @IsEnum(NoticeCategory)
  @Column({ default: NoticeCategory.NOTICE })
  category: NoticeCategory;

  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Column()
  title: string;

  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Column('longtext')
  description: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  thumbnail: string;

  @Field((type) => String)
  @Column()
  userId: string;
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.notices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
