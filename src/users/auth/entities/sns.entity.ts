import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsOptional, IsString, Length, Max } from 'class-validator';
import { User } from './user.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Sns {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  facebook: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  line: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  kakaotalk: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  twitter: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  instagram: string;

  @Field(() => String)
  @Column()
  userId: string;
  @OneToOne(
    type => User,
    user => user.sns,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'userId' })
  user: User;
}
