import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
} from 'typeorm/index';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from '../../../common/entities/core.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { Board } from '../../../boards/board/entities/board.entity';
import { BoardLike } from '../../../boards/board-like/entities/board-like.entitiy';
import { BoardComment } from '../../../boards/board-comment/entities/board-comment.entity';
import { Notice } from '../../../notices/notice/notice.entitiy';
import { OneToOne } from 'typeorm';
import { Sns } from './sns.entity';
import { Detail } from './detail.entity';
import { UserSubscription } from '../../user-subscription/user-subscription.entity';
import { UserSkill } from '../../user-skill/user-skill.entity';

export enum UserRole {
  Client,
  Admin,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(1, 16)
  @Column()
  username: string;

  @Field((type) => String)
  @IsEmail()
  @IsNotEmpty()
  @Length(0, 40)
  @Column({ unique: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 255)
  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column('longtext', { nullable: true })
  avatar: string;

  @Field((type) => UserRole, { defaultValue: UserRole.Client })
  @IsEnum(UserRole)
  @IsOptional()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  role?: UserRole;

  @Field((type) => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Column({ nullable: true })
  confirmCode: number;

  @Field(() => Sns, { nullable: true })
  @OneToOne((type) => Sns, (sns) => sns.user)
  sns: Sns;

  @Field(() => Detail, { nullable: true })
  @OneToOne((type) => Detail, (detail) => detail.user)
  detail: Detail;

  @OneToMany((type) => Board, (board) => board.user)
  boards: Board[];
  @OneToMany((type) => BoardLike, (like) => like.user)
  likes: BoardLike[];
  @OneToMany((type) => BoardComment, (comment) => comment.user)
  comments: BoardComment[];
  @OneToMany((type) => Notice, (notice) => notice.user)
  notices: Notice[];
  @Field(() => [UserSubscription], { nullable: true })
  @OneToMany(
    (type) => UserSubscription,
    (subscription) => subscription.subscriber,
  )
  subscriptions: UserSubscription[];
  @Field(() => [UserSubscription], { nullable: true })
  @OneToMany(
    (type) => UserSubscription,
    (subscription) => subscription.subscribedTo,
  )
  subscribers: UserSubscription[];

  @Field(() => [UserSkill])
  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  skills: UserSkill[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashedPassword() {
    try {
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async validatePassword(aPassword: string) {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
